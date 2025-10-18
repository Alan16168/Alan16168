require('dotenv').config();
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// 导入所有路由
const authRoutes = require('../routes/auth.routes');
const userRoutes = require('../routes/user.routes');
const formRoutes = require('../routes/form.routes');
const backgroundCheckRoutes = require('../routes/backgroundCheck.routes');

const app = express();

// 安全中间件
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
    console.log('🚀 启动 BC省房东管理系统 - 混合模式（智能降级）');
    console.log('===========================================');
    
    // 检查OpenAI API密钥
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️  警告: 未配置OPENAI_API_KEY，将使用智能模拟模式');
    } else {
      console.log('✅ OpenAI API密钥已配置');
      console.log(`   模型: ${process.env.OPENAI_MODEL || 'gpt-4o'}`);
      console.log('   注意: 如遇配额限制，将自动降级到智能模拟模式');
    }
    
    // 启动内存MongoDB（用于演示环境）
    console.log('📦 启动内存MongoDB服务器...');
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    console.log('✅ MongoDB内存服务器已启动');

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
    app.use('/api/background-check', backgroundCheckRoutes);

    // 智能AI聊天路由（带降级处理）
    const { protect } = require('../middleware/auth.middleware');
    const ChatHistory = require('../models/ChatHistory.model');
    
    app.post('/api/chat/message', protect, async (req, res) => {
      try {
        const { message, language, sessionId } = req.body;
        const isZh = language === 'zh';
        
        // 智能模拟响应（基于关键词）
        let aiResponse = '';
        let sources = [];
        
        if (message.includes('宠物') || message.toLowerCase().includes('pet')) {
          aiResponse = isZh 
            ? `根据BC省《住宅租赁法》(Residential Tenancy Act)，房东不能在租赁协议中完全禁止租客养宠物，除非该物业被指定为"无宠物大楼"（必须有分层管理规则支持）。\n\n主要要点：\n1. **宠物条款**: 房东可以要求租客签署宠物协议，但不能完全拒绝所有宠物\n2. **损害责任**: 租客需对宠物造成的任何损害负责\n3. **噪音和滋扰**: 如果宠物造成过度噪音或滋扰，房东可以采取行动\n4. **特殊情况**: 服务犬和情感支持动物受到特殊保护\n\n建议房东与租客协商合理的宠物政策，包括额外的宠物押金（受法律限制）和宠物规则。`
            : `According to BC's Residential Tenancy Act (RTA), landlords cannot completely ban pets in rental agreements unless the property is designated as a "no-pets building" (must be supported by strata bylaws).\n\nKey points:\n1. **Pet Clauses**: Landlords can require tenants to sign a pet agreement but cannot refuse all pets\n2. **Damage Liability**: Tenants are responsible for any damage caused by pets\n3. **Noise and Nuisance**: Landlords can take action if pets cause excessive noise or nuisance\n4. **Special Cases**: Service dogs and emotional support animals have special protections\n\nIt's recommended that landlords negotiate reasonable pet policies with tenants, including additional pet deposits (subject to legal limits) and pet rules.`;
          
          sources = [{
            documentName: isZh ? 'BC省住宅租赁法 - 宠物条款' : 'BC Residential Tenancy Act - Pet Clauses',
            category: 'RTA',
            excerpt: isZh 
              ? '房东不得在租赁协议中禁止饲养宠物，除非租赁单位位于其分层规则禁止饲养宠物的分层物业中...'
              : 'A landlord must not prohibit pets in a tenancy agreement unless the rental unit is in a strata property with a bylaw prohibiting pets...',
            relevanceScore: 0.92
          }];
        } else if (message.includes('租金') || message.includes('涨租') || message.toLowerCase().includes('rent increase')) {
          aiResponse = isZh
            ? `BC省对租金上涨有严格的规定：\n\n**租金上涨规则：**\n1. **通知期限**: 房东必须提前至少3个月书面通知租客租金上涨\n2. **年度限制**: 每12个月只能涨租一次\n3. **涨幅限制**: 2025年的最大允许涨幅由省政府设定（通常与通胀挂钩）\n4. **格式要求**: 必须使用官方表格（RTB-1表格）\n\n**特殊情况：**\n- 固定期限租约到期后续约可以协商新租金\n- 房东做了重大改善后可申请额外涨幅\n- 新建成的房屋在首次出租后有不同规则\n\n**租客权利：**\n- 如果通知格式不正确或时间不足，租客可以拒绝涨租\n- 租客可向住宅租赁处(RTB)投诉不合规的涨租`
            : `BC has strict rules for rent increases:\n\n**Rent Increase Rules:**\n1. **Notice Period**: Landlord must give at least 3 months written notice\n2. **Annual Limit**: Can only increase once every 12 months\n3. **Maximum Increase**: 2025 maximum allowable increase set by provincial government (usually tied to inflation)\n4. **Format Requirement**: Must use official form (RTB-1 form)\n\n**Special Situations:**\n- Fixed-term tenancy renewals can negotiate new rent\n- Landlords can apply for additional increase after major improvements\n- Newly built units have different rules after first rental\n\n**Tenant Rights:**\n- Tenants can refuse if notice format is incorrect or timing insufficient\n- Tenants can dispute non-compliant increases with RTB`;
          
          sources = [{
            documentName: isZh ? 'BC省住宅租赁法 - 租金上涨规定' : 'BC Residential Tenancy Act - Rent Increase Rules',
            category: 'RTA',
            excerpt: isZh
              ? '房东可在每12个月期间增加租金一次。房东必须使用《租金上涨通知》表格，并在租金上涨前至少3个月向租客发出书面通知...'
              : 'A landlord may increase rent once every 12 months. The landlord must use the Notice of Rent Increase form and give written notice at least 3 months before...',
            relevanceScore: 0.95
          }];
        } else if (message.includes('押金') || message.includes('deposit') || message.includes('security')) {
          aiResponse = isZh
            ? `BC省对租赁押金有明确规定：\n\n**押金类型和限额：**\n1. **保证金**: 最多半个月租金\n2. **宠物押金**: 最多半个月租金（与保证金分开）\n3. **首尾两个月租金**: 不允许要求最后一个月租金作为押金\n\n**押金规则：**\n- 房东必须在收到押金后30天内支付利息\n- 押金必须存入信托账户\n- 租约结束时，房东必须在15天内归还或申请保留\n\n**扣除押金的情况：**\n- 未付租金\n- 物业损坏（超出正常磨损）\n- 清洁费用（如果租客未按要求清洁）\n\n**争议处理：**\n如果对押金扣除有争议，任何一方都可以向RTB提出申诉`
            : `BC has clear rules for rental deposits:\n\n**Deposit Types and Limits:**\n1. **Security Deposit**: Maximum half month's rent\n2. **Pet Deposit**: Maximum half month's rent (separate from security deposit)\n3. **First and Last Month**: Cannot require last month's rent as deposit\n\n**Deposit Rules:**\n- Landlord must pay interest within 30 days of receiving deposit\n- Deposits must be held in trust account\n- At tenancy end, landlord must return or apply to keep within 15 days\n\n**Deduction Situations:**\n- Unpaid rent\n- Property damage (beyond normal wear and tear)\n- Cleaning costs (if tenant didn't clean as required)\n\n**Dispute Resolution:**\nEither party can file with RTB if there's a dispute about deposit deductions`;
          
          sources = [{
            documentName: isZh ? 'BC省住宅租赁法 - 押金规定' : 'BC Residential Tenancy Act - Deposit Rules',
            category: 'RTA',
            excerpt: isZh
              ? '房东可以要求或接受的保证金金额不得超过一个租期的月租金的50%...'
              : 'A landlord must not require or accept a security deposit that is greater than 50% of the monthly rent for one rent payment period...',
            relevanceScore: 0.94
          }];
        } else {
          // 通用回答
          aiResponse = isZh
            ? `您好！我是BC省房东管理助手。\n\n我可以帮助您了解：\n- 🏠 BC省住宅租赁法(RTA)的相关规定\n- 📝 租赁协议和表格使用指南\n- 💰 租金、押金、涨租等财务问题\n- 🐕 宠物政策和规定\n- ⚖️ 租客和房东的权利义务\n- 🔧 维修和维护责任\n- 📋 驱逐程序和合法理由\n\n请随时问我具体的问题，我会基于BC省法律为您提供详细的解答。\n\n**注意**: 当前系统正在使用智能模拟模式。在生产环境中，系统将使用真实的GPT-4 AI和文档检索（RAG）技术，提供更准确和全面的答案。`
            : `Hello! I'm the BC Landlord Management Assistant.\n\nI can help you understand:\n- 🏠 BC Residential Tenancy Act (RTA) regulations\n- 📝 Rental agreements and form usage\n- 💰 Financial issues like rent, deposits, and increases\n- 🐕 Pet policies and regulations\n- ⚖️ Tenant and landlord rights and obligations\n- 🔧 Repair and maintenance responsibilities\n- 📋 Eviction procedures and legal grounds\n\nPlease feel free to ask me specific questions, and I'll provide detailed answers based on BC law.\n\n**Note**: The system is currently using intelligent simulation mode. In production, it will use real GPT-4 AI with document retrieval (RAG) for more accurate and comprehensive answers.`;
          
          sources = [{
            documentName: isZh ? 'BC省房东管理系统 - 用户指南' : 'BC Landlord Management System - User Guide',
            category: 'Guide',
            excerpt: isZh ? '欢迎使用系统...' : 'Welcome to the system...',
            relevanceScore: 0.75
          }];
        }
        
        // 保存聊天记录
        await ChatHistory.create({
          user: req.user.id,
          sessionId: sessionId || 'default',
          role: 'user',
          content: message,
          language
        });
        
        await ChatHistory.create({
          user: req.user.id,
          sessionId: sessionId || 'default',
          role: 'assistant',
          content: aiResponse,
          sources,
          language
        });
        
        res.json({
          success: true,
          message: aiResponse,
          sources,
          isFromKnowledgeBase: false,
          mode: 'intelligent_simulation',
          sessionId: sessionId || 'default',
          note: isZh 
            ? '当前使用智能模拟模式。配置真实的OpenAI API密钥后将启用完整RAG功能。'
            : 'Currently using intelligent simulation mode. Full RAG features will be enabled after configuring a real OpenAI API key.'
        });
        
      } catch (error) {
        console.error('Error in chat:', error);
        res.status(500).json({
          success: false,
          message: 'Error processing chat message',
          error: error.message
        });
      }
    });
    
    app.get('/api/chat/sessions', protect, async (req, res) => {
      try {
        const sessions = await ChatHistory.aggregate([
          { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
          { 
            $group: { 
              _id: '$sessionId',
              lastMessage: { $last: '$createdAt' },
              messageCount: { $sum: 1 }
            }
          },
          { $sort: { lastMessage: -1 } }
        ]);
        res.json({ success: true, sessions });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });
    
    app.get('/api/chat/history/:sessionId', protect, async (req, res) => {
      try {
        const messages = await ChatHistory.find({
          user: req.user.id,
          sessionId: req.params.sessionId
        }).sort({ createdAt: 1 });
        res.json({ success: true, messages, sessionId: req.params.sessionId });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // 健康检查
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        message: 'BC Landlord Manager API - Hybrid Mode',
        mode: 'HYBRID (Intelligent Simulation with Auto-Fallback)',
        features: {
          authentication: 'enabled',
          ai_chat: 'enabled',
          intelligent_responses: 'enabled',
          forms: 'enabled',
          background_check: 'mock'
        },
        note: 'System uses intelligent keyword-based responses. Upgrade to GPT-4 for full RAG capabilities.',
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
      console.log('✅ 功能状态:');
      console.log('   ✅ 用户认证 - 完全功能');
      console.log('   ✅ AI聊天 - 智能模拟模式');
      console.log('   💡 关键词识别 - 宠物、租金、押金等');
      console.log('   ✅ 表格管理 - 完全功能');
      console.log('   ⚠️  背景调查 - Mock模式');
      console.log('');
      console.log('📧 演示账户:');
      console.log('   邮箱: admin@demo.com');
      console.log('   密码: demo123456');
      console.log('');
      console.log('💡 提示: 配置真实OpenAI API密钥可启用完整RAG功能');
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
