# BC省房东管理系统 / BC Landlord Manager

一个专业的房东管理网站，帮助加拿大BC省房东合法、智慧地管理出租房产。

## 🎯 核心功能

### 1. AI智能助手 (RAG系统)
- 基于上传的7个BC省官方文档的智能问答
- 自动标注回答来源（文档内 vs AI生成）
- 支持中英双语对话
- 文档相似度检索和引用

### 2. 租赁表格管理
- BC省官方租赁表格下载
- 详细的表格用途说明
- 分类浏览和搜索

### 3. 租客背景调查
- 在线申请背景调查
- 查看调查历史和状态
- 下载调查报告
- 仅高级用户/管理员可用

### 4. 用户管理系统
- 三级权限：普通用户、高级用户、管理员
- 用户注册和登录
- 个人资料管理

### 5. 中英双语
- 完整的i18n国际化支持
- 一键切换语言

## 📁 项目结构

```
/home/user/webapp/
├── backend/                    # Node.js后端
│   ├── src/
│   │   ├── server.js          # 主服务器文件
│   │   ├── models/            # MongoDB数据模型
│   │   │   ├── User.model.js
│   │   │   ├── Document.model.js
│   │   │   └── ChatHistory.model.js
│   │   ├── controllers/       # 业务逻辑控制器
│   │   │   ├── auth.controller.js
│   │   │   ├── chat.controller.js
│   │   │   ├── form.controller.js
│   │   │   ├── document.controller.js
│   │   │   └── backgroundCheck.controller.js
│   │   ├── routes/            # API路由
│   │   ├── middleware/        # 中间件（认证、权限等）
│   │   └── config/            # 配置文件
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # React前端
│   ├── src/
│   │   ├── main.jsx           # 入口文件
│   │   ├── App.jsx            # 主应用组件
│   │   ├── pages/             # 页面组件
│   │   │   ├── Home.jsx
│   │   │   ├── Chat.jsx       # AI聊天界面
│   │   │   ├── Forms.jsx      # 表格管理
│   │   │   ├── BackgroundCheck.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── components/        # 可复用组件
│   │   ├── services/          # API服务
│   │   │   └── api.js
│   │   ├── stores/            # Zustand状态管理
│   │   │   └── authStore.js
│   │   ├── locales/           # 国际化文件
│   │   │   ├── en.json
│   │   │   └── zh.json
│   │   └── i18n.js
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## 🚀 安装和运行

### 前置要求
- Node.js 18+
- MongoDB 5.0+
- OpenAI API密钥

### 1. 安装依赖

#### 后端
```bash
cd /home/user/webapp/backend
npm install
```

#### 前端
```bash
cd /home/user/webapp/frontend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并配置：

```bash
cd /home/user/webapp/backend
cp .env.example .env
```

编辑 `.env` 文件：
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bc-landlord-manager
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-your-openai-api-key
FRONTEND_URL=http://localhost:3000
```

### 3. 启动MongoDB

```bash
# 使用Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 或使用本地MongoDB
mongod --dbpath /path/to/data
```

### 4. 上传初始文档（管理员操作）

系统需要上传以下7个文档到MongoDB：
1. Converting to Excel To Word_房屋维护表.docx
2. BC RESIDENTIAL TENANCY REGULATION.docx
3. rtb1_chrome.docx
4. BC RTA.docx
5. 加拿大BC省出租管理电话.docx
6. 加拿大BC省房屋维护指南.docx
7. BC省民用住宅出租管理完全手册.docx

使用管理员账户登录后，通过 `/api/documents/upload` 接口上传。

### 5. 运行应用

#### 开发模式

终端1 - 后端：
```bash
cd /home/user/webapp/backend
npm run dev
```

终端2 - 前端：
```bash
cd /home/user/webapp/frontend
npm run dev
```

前端: http://localhost:3000
后端API: http://localhost:5000

#### 生产模式

```bash
# 构建前端
cd /home/user/webapp/frontend
npm run build

# 启动后端
cd /home/user/webapp/backend
npm start
```

## 🔑 默认管理员账户

首次使用时需要创建管理员账户：

```bash
# 使用MongoDB直接创建
mongosh bc-landlord-manager
db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "$2a$10$...", // 使用bcrypt加密
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

## 📚 API文档

### 认证 API

#### POST /api/auth/register
注册新用户
```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "password": "password123",
  "phone": "604-123-4567",
  "address": {
    "street": "123 Main St",
    "city": "Vancouver",
    "province": "BC",
    "postalCode": "V6B 1A1"
  },
  "propertyTypes": ["Single Family", "Condo"],
  "language": "zh"
}
```

#### POST /api/auth/login
用户登录
```json
{
  "email": "zhangsan@example.com",
  "password": "password123"
}
```

### 聊天 API

#### POST /api/chat/message
发送聊天消息
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
  "sources": [
    {
      "documentName": "BC RTA.docx",
      "category": "RTA",
      "excerpt": "...",
      "relevanceScore": 0.89
    }
  ],
  "isFromKnowledgeBase": true
}
```

### 表格 API

#### GET /api/forms?language=zh&category=Tenancy%20Agreement
获取所有表格

#### GET /api/forms/:id?language=zh
获取单个表格详情

### 背景调查 API (需要Premium权限)

#### POST /api/background-check/request
申请背景调查
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "604-123-4567",
  "dateOfBirth": "1990-01-01",
  "address": "123 Main St, Vancouver",
  "consent": true
}
```

## 🔐 权限系统

### 用户角色

1. **普通用户 (user)**
   - AI聊天助手
   - 表格下载和查看
   - 个人资料管理

2. **高级用户 (premium)**
   - 所有普通用户功能
   - 租客背景调查
   - 优先支持

3. **管理员 (admin)**
   - 所有功能
   - 文档管理
   - 用户管理
   - 系统配置

## 🌐 国际化

系统支持中英双语：
- 所有界面文本
- API响应消息
- 表格说明
- AI回答语言

切换语言：
```javascript
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();
i18n.changeLanguage('zh'); // 或 'en'
```

## 🤖 RAG系统工作原理

1. **文档处理**
   - 上传的DOCX文件提取文本
   - 文本分块（chunk size: 1000字符，overlap: 200字符）
   - 使用OpenAI Embeddings API生成向量

2. **查询处理**
   - 用户问题转换为向量
   - 计算与所有文档块的余弦相似度
   - 返回Top 3最相关的文档块

3. **回答生成**
   - 相似度 > 0.7: 标记为"来自BC省文档"
   - 相似度 ≤ 0.7: 标记为"AI生成回答"
   - 包含文档引用和摘要

## 🔧 技术栈

### 后端
- **框架**: Express.js
- **数据库**: MongoDB + Mongoose
- **认证**: JWT + bcryptjs
- **AI**: OpenAI GPT-4 + Embeddings API
- **文档处理**: mammoth (DOCX), pdf-parse
- **安全**: helmet, cors, rate-limit

### 前端
- **框架**: React 18
- **构建工具**: Vite
- **路由**: React Router v6
- **状态管理**: Zustand
- **国际化**: react-i18next
- **样式**: Tailwind CSS
- **HTTP客户端**: Axios
- **图标**: lucide-react

## 📝 待完成功能

- [ ] 房屋维护提醒系统
- [ ] 租金收支记录
- [ ] 租客信息管理
- [ ] 邮件通知系统
- [ ] 文档模板自动生成
- [ ] 移动端响应式优化
- [ ] 实际背景调查API集成（Certn, TransUnion）

## 🐛 已知问题

1. 首次加载可能需要较长时间（Embedding生成）
2. 大文档处理可能超时（需要优化）
3. 背景调查功能目前为Mock数据

## 📄 许可证

MIT License

## 👨‍💻 作者

Alan Deng (alan@alandeng.ca)

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 支持

如有问题，请联系：alan@alandeng.ca
