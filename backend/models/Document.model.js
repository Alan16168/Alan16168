const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['RTA', 'Regulation', 'Tenancy_Agreement', 'Maintenance', 'Contact', 'Manual', 'Other'],
    default: 'Other'
  },
  content: {
    type: String, // Extracted text content for RAG
    required: true
  },
  chunks: [{
    text: String,
    embedding: [Number], // Vector embedding for similarity search
    chunkIndex: Number
  }],
  metadata: {
    pageCount: Number,
    language: String,
    tags: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for text search
documentSchema.index({ content: 'text', originalName: 'text' });

// Index for category filtering
documentSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Document', documentSchema);
