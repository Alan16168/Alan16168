const OpenAI = require('openai');
const ChatHistory = require('../models/ChatHistory.model');
const Document = require('../models/Document.model');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Simple vector similarity (cosine similarity)
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

// @desc    Get embeddings for text
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

// @desc    Search relevant documents
const searchRelevantDocs = async (query, topK = 5) => {
  try {
    // Get query embedding
    const queryEmbedding = await getEmbedding(query);
    
    // Get all active documents with embeddings
    const documents = await Document.find({ isActive: true, 'chunks.0': { $exists: true } });
    
    const relevantChunks = [];
    
    // Calculate similarity for each chunk
    documents.forEach(doc => {
      doc.chunks.forEach(chunk => {
        if (chunk.embedding && chunk.embedding.length > 0) {
          const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
          relevantChunks.push({
            documentId: doc._id,
            documentName: doc.originalName,
            category: doc.category,
            text: chunk.text,
            similarity,
            chunkIndex: chunk.chunkIndex
          });
        }
      });
    });
    
    // Sort by similarity and get top K
    relevantChunks.sort((a, b) => b.similarity - a.similarity);
    return relevantChunks.slice(0, topK);
  } catch (error) {
    console.error('Error searching documents:', error);
    return [];
  }
};

// @desc    Send chat message
// @route   POST /api/chat/message
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId, language } = req.body;
    const userId = req.user.id;

    if (!message || !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Message and sessionId are required'
      });
    }

    // Search for relevant documents
    const relevantDocs = await searchRelevantDocs(message, 3);
    
    // Check if response should be from knowledge base
    const isFromKnowledgeBase = relevantDocs.length > 0 && relevantDocs[0].similarity > 0.7;
    
    // Build context from relevant documents
    let context = '';
    if (relevantDocs.length > 0) {
      context = 'Relevant information from BC Province documents:\n\n';
      relevantDocs.forEach((doc, i) => {
        context += `Source ${i + 1} (${doc.documentName} - ${doc.category}):\n${doc.text}\n\n`;
      });
    }

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({ sessionId, user: userId });
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        user: userId,
        sessionId,
        messages: []
      });
    }

    // Build messages for OpenAI
    const systemPrompt = language === 'zh' 
      ? `你是一个专业的BC省房东助手。你的主要职责是帮助房东理解和遵守BC省的租赁法律法规，提供房屋维护建议，以及协助租客背景调查。

重要规则：
1. 如果问题与提供的BC省文档相关，必须基于文档内容回答，并明确标注来源文档名称
2. 如果问题超出文档范围，明确说明"此问题超出BC省官方文档范围，以下是基于AI知识的建议"
3. 始终使用中文回答
4. 提供准确、实用的建议
5. 涉及法律问题时，建议用户咨询专业律师

${context ? '请基于以下文档内容回答：\n' + context : ''}`
      : `You are a professional BC Province landlord assistant. Your main responsibilities are to help landlords understand and comply with BC rental laws, provide property maintenance advice, and assist with tenant background checks.

Important rules:
1. If the question relates to provided BC documents, answer based on document content and clearly cite source document names
2. If the question is outside document scope, clearly state "This question is beyond BC official documents, here is AI-based advice"
3. Always respond in English
4. Provide accurate, practical advice
5. For legal matters, recommend consulting a professional lawyer

${context ? 'Please answer based on the following document content:\n' + context : ''}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 1500
    });

    const assistantMessage = completion.choices[0].message.content;

    // Save user message
    chatHistory.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Save assistant message with sources
    chatHistory.messages.push({
      role: 'assistant',
      content: assistantMessage,
      timestamp: new Date(),
      isFromKnowledgeBase,
      sources: relevantDocs.map(doc => ({
        documentId: doc.documentId,
        documentName: doc.documentName,
        excerpt: doc.text.substring(0, 200) + '...',
        relevanceScore: doc.similarity,
        category: doc.category
      }))
    });

    // Update chat title if it's the first message
    if (chatHistory.messages.length === 2) {
      chatHistory.title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
    }

    await chatHistory.save();

    res.json({
      success: true,
      message: assistantMessage,
      sources: relevantDocs.map(doc => ({
        documentName: doc.documentName,
        category: doc.category,
        excerpt: doc.text.substring(0, 200) + '...',
        relevanceScore: doc.similarity
      })),
      isFromKnowledgeBase,
      sessionId
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing chat message',
      error: error.message
    });
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history/:sessionId
// @access  Private
exports.getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const chatHistory = await ChatHistory.findOne({ 
      sessionId, 
      user: userId 
    }).populate('messages.sources.documentId', 'originalName category');

    if (!chatHistory) {
      return res.json({
        success: true,
        messages: [],
        sessionId
      });
    }

    res.json({
      success: true,
      messages: chatHistory.messages,
      title: chatHistory.title,
      sessionId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chat history',
      error: error.message
    });
  }
};

// @desc    Get all chat sessions
// @route   GET /api/chat/sessions
// @access  Private
exports.getChatSessions = async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await ChatHistory.find({ 
      user: userId,
      isActive: true
    })
    .select('sessionId title createdAt updatedAt')
    .sort({ updatedAt: -1 })
    .limit(50);

    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chat sessions',
      error: error.message
    });
  }
};

// @desc    Delete chat session
// @route   DELETE /api/chat/session/:sessionId
// @access  Private
exports.deleteChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    await ChatHistory.findOneAndUpdate(
      { sessionId, user: userId },
      { isActive: false }
    );

    res.json({
      success: true,
      message: 'Chat session deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting chat session',
      error: error.message
    });
  }
};
