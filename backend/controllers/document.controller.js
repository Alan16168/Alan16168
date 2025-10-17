const mammoth = require('mammoth');
const OpenAI = require('openai');
const Document = require('../models/Document.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf',
      'text/plain'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only DOCX, PDF, and TXT files are allowed.'));
    }
  }
}).single('document');

// Extract text from DOCX file
const extractTextFromDocx = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw error;
  }
};

// Split text into chunks
const splitTextIntoChunks = (text, chunkSize = 1000, overlap = 200) => {
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.substring(start, end));
    start = end - overlap;
  }
  
  return chunks;
};

// Get embedding for text chunk
const getEmbedding = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error getting embedding:', error);
    throw error;
  }
};

// @desc    Upload and process document
// @route   POST /api/documents/upload
// @access  Private (Admin only)
exports.uploadDocument = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    try {
      const { category, tags } = req.body;
      const filePath = req.file.path;

      // Extract text content
      let content = '';
      if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        content = await extractTextFromDocx(filePath);
      } else if (req.file.mimetype === 'text/plain') {
        content = await fs.readFile(filePath, 'utf-8');
      }

      // Split into chunks
      const textChunks = splitTextIntoChunks(content);

      // Get embeddings for each chunk
      const chunks = await Promise.all(
        textChunks.map(async (text, index) => {
          const embedding = await getEmbedding(text);
          return {
            text,
            embedding,
            chunkIndex: index
          };
        })
      );

      // Save document to database
      const document = await Document.create({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        category: category || 'Other',
        content,
        chunks,
        metadata: {
          pageCount: textChunks.length,
          tags: tags ? tags.split(',').map(t => t.trim()) : []
        },
        uploadedBy: req.user.id
      });

      // Clean up uploaded file
      await fs.unlink(filePath);

      res.status(201).json({
        success: true,
        message: 'Document uploaded and processed successfully',
        document: {
          id: document._id,
          originalName: document.originalName,
          category: document.category,
          size: document.size,
          chunkCount: chunks.length
        }
      });
    } catch (error) {
      console.error('Document upload error:', error);
      // Clean up file if it exists
      if (req.file && req.file.path) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      res.status(500).json({
        success: false,
        message: 'Error processing document',
        error: error.message
      });
    }
  });
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private (Admin only)
exports.getAllDocuments = async (req, res) => {
  try {
    const { category, isActive = true } = req.query;
    
    const filter = { isActive };
    if (category) filter.category = category;
    
    const documents = await Document.find(filter)
      .select('-content -chunks')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching documents',
      error: error.message
    });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private (Admin only)
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await Document.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting document',
      error: error.message
    });
  }
};

module.exports = exports;
