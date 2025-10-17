# BC省房东管理系统 / BC Landlord Manager System

<div align="center">

**一个专业的BC省房东出租管理平台，帮助房东合法、智慧地管理出租房产**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

[English](#english) | [中文](#中文)

</div>

---

## 中文

### 🎯 项目简介

BC省房东管理系统是一个全栈Web应用，专为加拿大BC省的房东设计，提供以下核心功能：

1. **AI智能助手** - 基于RAG技术，使用OpenAI GPT-4，回答基于BC省官方文档的问题
2. **租赁表格管理** - 提供BC省所有官方租赁表格的详细介绍和下载链接
3. **租客背景调查** - 在线申请和管理租客背景调查（高级用户功能）
4. **三级用户系统** - 普通用户、高级用户、管理员
5. **中英双语** - 完整的国际化支持

### ✨ 核心特性

#### 1. RAG智能问答系统
- 📚 基于7个BC省官方文档的知识库
- 🔍 向量相似度检索（OpenAI Embeddings）
- 📝 自动标注回答来源（文档内 vs AI生成）
- 🌐 中英双语对话支持
- 📖 显示引用文档和相关性分数

#### 2. 表格管理系统
- 📋 8个主要BC省租赁表格
- 🔗 官方下载链接
- 📚 详细用途说明（中英文）
- 🏷️ 分类浏览和筛选

#### 3. 背景调查功能
- ✅ 在线申请租客背景调查
- 📊 查看调查历史和状态
- 📥 下载调查报告
- 🔐 仅高级用户/管理员可用

#### 4. 用户权限系统
- **普通用户**: AI助手、表格下载
- **高级用户**: + 背景调查
- **管理员**: + 用户管理、文档管理

### 🚀 快速开始

#### 前置要求
```bash
Node.js >= 18.0.0
MongoDB >= 5.0
OpenAI API密钥
```

#### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd webapp
```

2. **安装后端依赖**
```bash
cd backend
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的配置
```

必须配置的环境变量：
```env
MONGODB_URI=mongodb://localhost:27017/bc-landlord-manager
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=sk-your-openai-api-key
```

4. **安装前端依赖**
```bash
cd ../frontend
npm install
```

5. **启动MongoDB**
```bash
# Docker方式
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 或本地MongoDB
mongod --dbpath /path/to/data
```

6. **启动应用**

终端1 - 后端：
```bash
cd backend
npm run dev
```

终端2 - 前端：
```bash
cd frontend
npm run dev
```

访问：http://localhost:3000

### 📁 项目结构

```
webapp/
├── backend/                 # Node.js后端
│   ├── src/
│   │   ├── server.js       # 主服务器
│   │   ├── models/         # MongoDB模型
│   │   ├── controllers/    # 业务逻辑
│   │   ├── routes/         # API路由
│   │   └── middleware/     # 中间件
│   └── package.json
│
├── frontend/                # React前端
│   ├── src/
│   │   ├── pages/          # 页面组件
│   │   ├── components/     # 通用组件
│   │   ├── services/       # API服务
│   │   ├── stores/         # Zustand状态
│   │   └── locales/        # i18n翻译
│   └── package.json
│
└── README.md
```

### 🔑 初始化管理员账户

首次使用需要创建管理员账户。有两种方式：

**方式1: 通过API注册后手动升级**
```bash
# 1. 先通过前端注册普通账户
# 2. 然后在MongoDB中手动更新角色
mongosh bc-landlord-manager
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**方式2: 直接在MongoDB创建**
```javascript
// 使用bcrypt生成密码哈希
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('your-password', 10);

// 在MongoDB中插入
db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: hash,  // 上面生成的哈希
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

### 📤 上传知识库文档（管理员操作）

系统需要上传以下7个文档来构建知识库：

1. Converting to Excel To Word_房屋维护表.docx
2. BC RESIDENTIAL TENANCY REGULATION.docx
3. rtb1_chrome.docx
4. BC RTA.docx
5. 加拿大BC省出租管理电话.docx
6. 加拿大BC省房屋维护指南.docx
7. BC省民用住宅出租管理完全手册.docx

使用管理员账户登录后，通过API上传：

```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "document=@/path/to/document.docx" \
  -F "category=RTA"
```

或使用前端管理面板上传。

### 📚 API文档

#### 认证API

**POST** `/api/auth/register` - 注册用户
```json
{
  "name": "张三",
  "email": "zhang@example.com",
  "password": "password123",
  "language": "zh"
}
```

**POST** `/api/auth/login` - 登录
```json
{
  "email": "zhang@example.com",
  "password": "password123"
}
```

**GET** `/api/auth/me` - 获取当前用户信息（需要Token）

#### 聊天API

**POST** `/api/chat/message` - 发送消息
```json
{
  "message": "如何合法提高租金?",
  "sessionId": "session-123",
  "language": "zh"
}
```

响应：
```json
{
  "success": true,
  "message": "根据BC省租赁法规...",
  "sources": [{
    "documentName": "BC RTA.docx",
    "relevanceScore": 0.89
  }],
  "isFromKnowledgeBase": true
}
```

#### 表格API

**GET** `/api/forms?language=zh` - 获取所有表格

**GET** `/api/forms/:id?language=zh` - 获取单个表格详情

#### 背景调查API（需要Premium权限）

**POST** `/api/background-check/request` - 申请背景调查

**GET** `/api/background-check/history` - 查看历史记录

### 🛠️ 技术栈

#### 后端
- **框架**: Express.js
- **数据库**: MongoDB + Mongoose
- **认证**: JWT + bcryptjs
- **AI**: OpenAI GPT-4 Turbo + Embeddings API
- **文档处理**: mammoth (DOCX解析)
- **安全**: helmet, cors, express-rate-limit

#### 前端
- **框架**: React 18
- **构建**: Vite
- **路由**: React Router v6
- **状态管理**: Zustand
- **国际化**: react-i18next
- **样式**: Tailwind CSS
- **HTTP**: Axios

### 🔐 安全特性

- JWT Token认证
- 密码bcrypt加密
- API速率限制
- Helmet安全头
- CORS跨域保护
- 输入验证和清洗

### 🌐 部署指南

#### 生产环境部署

1. **构建前端**
```bash
cd frontend
npm run build
```

2. **配置环境变量**
```bash
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-secret
OPENAI_API_KEY=your-production-key
```

3. **使用PM2启动后端**
```bash
cd backend
npm install -g pm2
pm2 start src/server.js --name bc-landlord-api
```

4. **配置Nginx反向代理**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 🐛 故障排除

#### MongoDB连接失败
```bash
# 检查MongoDB是否运行
mongosh
# 或
docker ps | grep mongo
```

#### OpenAI API错误
- 检查API密钥是否正确
- 确认账户有足够额度
- 查看API使用限制

#### 前端无法连接后端
- 检查CORS配置
- 确认后端URL正确
- 查看浏览器控制台错误

### 📝 待实现功能

- [ ] 房屋维护提醒系统
- [ ] 租金收支记录
- [ ] 租客信息CRM
- [ ] 邮件/短信通知
- [ ] 文档自动生成
- [ ] 移动端优化
- [ ] 实际背景调查API集成

### 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 📄 许可证

MIT License

### 👨‍💻 作者

Alan Deng - alan@alandeng.ca

---

## English

### 🎯 Project Overview

BC Landlord Manager is a full-stack web application designed for landlords in British Columbia, Canada, providing:

1. **AI Assistant** - RAG-based chatbot using OpenAI GPT-4
2. **Form Management** - BC Province official rental forms with detailed descriptions
3. **Background Checks** - Online tenant screening (Premium feature)
4. **Three-tier User System** - User, Premium, Admin
5. **Bilingual Support** - English and Chinese

### ✨ Key Features

#### 1. RAG-based AI Assistant
- 📚 Knowledge base built from 7 official BC documents
- 🔍 Vector similarity search (OpenAI Embeddings)
- 📝 Automatic source citation (Document-based vs AI-generated)
- 🌐 Bilingual conversations
- 📖 Display source documents with relevance scores

#### 2. Form Management
- 📋 8 major BC rental forms
- 🔗 Official download links
- 📚 Detailed descriptions (English & Chinese)
- 🏷️ Category filtering

#### 3. Background Check System
- ✅ Online tenant screening requests
- 📊 View check history and status
- 📥 Download reports
- 🔐 Premium/Admin only

#### 4. User Permission System
- **Regular User**: AI assistant, form downloads
- **Premium User**: + Background checks
- **Administrator**: + User management, document management

### 🚀 Quick Start

#### Prerequisites
```bash
Node.js >= 18.0.0
MongoDB >= 5.0
OpenAI API Key
```

#### Installation

1. **Clone Repository**
```bash
git clone <repository-url>
cd webapp
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

Required environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/bc-landlord-manager
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=sk-your-openai-api-key
```

4. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

5. **Start MongoDB**
```bash
# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or local MongoDB
mongod --dbpath /path/to/data
```

6. **Run Application**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Visit: http://localhost:3000

### 🛠️ Tech Stack

**Backend**: Express.js, MongoDB, OpenAI, JWT, bcryptjs
**Frontend**: React 18, Vite, React Router, Zustand, Tailwind CSS, i18next

### 📧 Contact

For questions or support: alan@alandeng.ca

---

<div align="center">
Made with ❤️ by Alan Deng
</div>
