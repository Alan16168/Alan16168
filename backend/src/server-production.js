require('dotenv').config();
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// 导入所有路由（包括需要OpenAI的）
const authRoutes = require('../routes/auth.routes');
const userRoutes = require('../routes/user.routes');
const formRoutes = require('../routes/form.routes');
const chatRoutes = require('../routes/chat.routes');
const documentRoutes = require('../routes/document.routes');
const backgroundCheckRoutes = require('../routes/backgroundCheck.routes');

const app = express();

// 安全中间件
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// 请求日志
app.use(morgan('combined'));

// Body解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 启动MongoDB内存服务器
let mongod;

async function startServer() {
  try {
    console.log('🚀 启动 BC省房东管理系统 - 生产模式（带真实AI）');
    console.log('===========================================');
    
    // 检查OpenAI API密钥
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️  警告: 未配置OPENAI_API_KEY');
    } else {
      console.log('✅ OpenAI API密钥已配置');
      console.log(`   模型: ${process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'}`);
    }
    
    // 启动内存MongoDB（用于演示环境）
    console.log('📦 启动内存MongoDB服务器...');
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    console.log('✅ MongoDB内存服务器已启动');
    console.log(`   URI: ${mongoUri}`);

    // 连接MongoDB
    console.log('🔌 连接到MongoDB...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB连接成功');

    // 创建默认管理员用户
    const User = require('../models/User.model');
    const bcrypt = require('bcryptjs');
    
    const adminExists = await User.findOne({ email: 'admin@demo.com' });
    if (!adminExists) {
      console.log('👤 创建演示管理员账户...');
      // Pass plain password - the model's pre-save hook will hash it
      await User.create({
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: 'demo123456', // Plain password - model will hash it
        role: 'admin',
        isActive: true,
        language: 'zh',
        createdAt: new Date()
      });
      console.log('✅ 演示管理员创建成功');
      console.log('   📧 邮箱: admin@demo.com');
      console.log('   🔑 密码: demo123456');
    }

    // 创建uploads目录
    const fs = require('fs');
    const path = require('path');
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('✅ 创建uploads目录');
    }

    // 注册所有路由
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/forms', formRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/documents', documentRoutes);
    app.use('/api/background-check', backgroundCheckRoutes);

    // 健康检查
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        message: 'BC Landlord Manager API - Production Mode',
        mode: 'PRODUCTION (Real AI)',
        features: {
          authentication: 'enabled',
          ai_chat: process.env.OPENAI_API_KEY ? 'enabled' : 'disabled',
          rag: process.env.OPENAI_API_KEY ? 'enabled' : 'disabled',
          documents: 'enabled',
          forms: 'enabled',
          background_check: 'mock'
        },
        timestamp: new Date().toISOString()
      });
    });

    // 静态文件服务（上传的文档）
    app.use('/uploads', express.static(uploadDir));

    // 404处理
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'API endpoint not found'
      });
    });

    // 错误处理
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
      });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('===========================================');
      console.log(`🎉 服务器启动成功！`);
      console.log('===========================================');
      console.log(`📍 后端API: http://localhost:${PORT}`);
      console.log(`📍 健康检查: http://localhost:${PORT}/api/health`);
      console.log('');
      console.log('✅ 所有功能已启用:');
      console.log('   ✅ 用户认证 - 完全功能');
      console.log('   ✅ AI聊天 - 真实GPT-4响应');
      console.log('   ✅ RAG检索 - 基于文档的智能回答');
      console.log('   ✅ 文档管理 - 完全功能');
      console.log('   ✅ 表格管理 - 完全功能');
      console.log('   ⚠️  背景调查 - Mock模式');
      console.log('');
      console.log('📧 演示账户:');
      console.log('   邮箱: admin@demo.com');
      console.log('   密码: demo123456');
      console.log('');
      console.log('按 Ctrl+C 停止服务器');
      console.log('===========================================');
    });

  } catch (error) {
    console.error('❌ 启动失败:', error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n🛑 正在关闭服务器...');
  if (mongod) {
    await mongod.stop();
    console.log('✅ MongoDB内存服务器已关闭');
  }
  await mongoose.connection.close();
  console.log('✅ 数据库连接已关闭');
  console.log('👋 再见！');
  process.exit(0);
});

// 启动服务器
startServer();
