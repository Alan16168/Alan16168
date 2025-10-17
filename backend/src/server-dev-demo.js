const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// 导入路由（不包含需要OpenAI的）
const authRoutes = require('../routes/auth.routes');
const userRoutes = require('../routes/user.routes');
const formRoutes = require('../routes/form.routes');

const app = express();

// 安全中间件
app.use(helmet());
app.use(cors({
  origin: '*', // 开发环境允许所有来源
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
    console.log('🚀 启动 BC省房东管理系统 - 演示模式');
    console.log('===========================================');
    
    // 启动内存MongoDB
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
      const hashedPassword = await bcrypt.hash('demo123456', 10);
      await User.create({
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        language: 'zh',
        createdAt: new Date()
      });
      console.log('✅ 演示管理员创建成功');
      console.log('   📧 邮箱: admin@demo.com');
      console.log('   🔑 密码: demo123456');
    }

    // 注册路由
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/forms', formRoutes);

    // Mock的聊天路由（不需要OpenAI）
    app.post('/api/chat/message', (req, res) => {
      const { message, language } = req.body;
      const isZh = language === 'zh';
      
      res.json({
        success: true,
        message: isZh 
          ? `这是一个演示回答。在完整版本中，系统会使用OpenAI GPT-4和RAG技术，基于BC省官方文档回答您的问题：「${message}」\n\n要启用完整AI功能，请配置OpenAI API密钥。`
          : `This is a demo response. In the full version, the system uses OpenAI GPT-4 with RAG technology to answer based on BC official documents: "${message}"\n\nTo enable full AI features, please configure your OpenAI API key.`,
        sources: [
          {
            documentName: isZh ? 'BC省租赁法（演示）' : 'BC RTA (Demo)',
            category: 'RTA',
            excerpt: isZh ? '这是演示文档摘录...' : 'This is a demo document excerpt...',
            relevanceScore: 0.85
          }
        ],
        isFromKnowledgeBase: false,
        sessionId: req.body.sessionId
      });
    });

    app.get('/api/chat/sessions', (req, res) => {
      res.json({ success: true, sessions: [] });
    });

    app.get('/api/chat/history/:sessionId', (req, res) => {
      res.json({ success: true, messages: [], sessionId: req.params.sessionId });
    });

    // Mock背景调查路由
    app.post('/api/background-check/request', (req, res) => {
      res.json({
        success: true,
        message: 'Background check request submitted (demo mode)',
        data: {
          checkId: `DEMO-${Date.now()}`,
          status: 'pending',
          estimatedCompletionTime: '24-48 hours',
          applicant: req.body
        }
      });
    });

    app.get('/api/background-check/history', (req, res) => {
      res.json({ success: true, count: 0, data: [] });
    });

    // 健康检查
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        message: 'BC Landlord Manager API - Demo Mode',
        mode: 'DEMO (Memory MongoDB, Mock AI)',
        timestamp: new Date().toISOString()
      });
    });

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
      console.log('⚠️  这是演示模式:');
      console.log('   ✅ 用户认证 - 完全功能');
      console.log('   ✅ 表格管理 - 完全功能');
      console.log('   ⚠️  AI助手 - Mock模式（需配置OpenAI）');
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
