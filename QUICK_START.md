# 快速启动指南 / Quick Start Guide

## 🚀 5分钟快速启动

### 1. 安装依赖

```bash
# 后端
cd /home/user/webapp/backend
npm install

# 前端
cd /home/user/webapp/frontend
npm install
```

### 2. 配置环境变量

```bash
cd /home/user/webapp/backend
cp .env.example .env
```

编辑 `.env` 文件，最少需要配置：
```env
MONGODB_URI=mongodb://localhost:27017/bc-landlord-manager
JWT_SECRET=my-super-secret-key-12345
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. 启动MongoDB

**使用Docker（推荐）：**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**或使用本地MongoDB：**
```bash
mongod --dbpath ./data
```

### 4. 启动应用

**开发模式 - 需要两个终端：**

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

### 5. 访问应用

打开浏览器访问：**http://localhost:3000**

## 📝 首次使用

### 创建管理员账户

1. 在前端注册一个普通账户
2. 在MongoDB中将其升级为管理员：

```bash
mongosh bc-landlord-manager

db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### 上传知识库文档

管理员登录后，需要上传7个文档以构建AI知识库。

使用API上传（需要管理员Token）：

```bash
# 获取Token（登录后从浏览器开发者工具的Network标签获取）
TOKEN="your-admin-jwt-token"

# 上传文档
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "document=@path/to/document.docx" \
  -F "category=RTA"
```

需要上传的文档：
1. BC RTA.docx (category: RTA)
2. BC RESIDENTIAL TENANCY REGULATION.docx (category: Regulation)
3. rtb1_chrome.docx (category: Tenancy_Agreement)
4. Converting to Excel To Word_房屋维护表.docx (category: Maintenance)
5. 加拿大BC省出租管理电话.docx (category: Contact)
6. 加拿大BC省房屋维护指南.docx (category: Maintenance)
7. BC省民用住宅出租管理完全手册.docx (category: Manual)

## 🧪 测试功能

### 1. 测试AI聊天

登录后，进入"AI助手"页面，尝试问问题：
- "如何合法提高租金？"
- "What is the notice period for ending a tenancy?"
- "房屋维护的注意事项有哪些？"

### 2. 测试表格下载

访问"表格下载"页面，查看和下载BC省官方表格。

### 3. 测试背景调查（需要Premium账户）

将账户升级为Premium：
```bash
mongosh bc-landlord-manager
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "premium" } }
)
```

然后访问"背景调查"页面进行测试。

## ❓ 常见问题

### MongoDB连接失败

**错误**: `MongoServerError: connect ECONNREFUSED`

**解决**:
```bash
# 检查MongoDB是否运行
docker ps | grep mongo

# 或
ps aux | grep mongod

# 如果没有运行，启动它
docker start mongodb
# 或
mongod --dbpath ./data
```

### OpenAI API错误

**错误**: `401 Unauthorized` 或 `Insufficient quota`

**解决**:
1. 检查 `.env` 文件中的 `OPENAI_API_KEY` 是否正确
2. 访问 https://platform.openai.com/account/billing 检查额度
3. 确保API密钥有效且未过期

### 前端无法连接后端

**错误**: `Network Error` 或 `CORS Error`

**解决**:
1. 确认后端正在运行（http://localhost:5000/api/health）
2. 检查 `.env` 中的 `FRONTEND_URL` 配置
3. 清除浏览器缓存并重试

### 文档上传失败

**错误**: `Error processing document`

**解决**:
1. 确认文件格式为 .docx
2. 检查文件大小 < 10MB
3. 确认有管理员权限
4. 查看后端日志获取详细错误信息

## 🔧 开发提示

### 查看后端日志
```bash
cd /home/user/webapp/backend
npm run dev
# 日志会实时显示在终端
```

### 查看数据库内容
```bash
mongosh bc-landlord-manager

# 查看用户
db.users.find().pretty()

# 查看文档
db.documents.find().pretty()

# 查看聊天记录
db.chathistories.find().pretty()
```

### 清空数据库（重新开始）
```bash
mongosh bc-landlord-manager

# 删除所有集合
db.users.deleteMany({})
db.documents.deleteMany({})
db.chathistories.deleteMany({})
```

## 📞 获取帮助

- 邮箱：alan@alandeng.ca
- 查看详细文档：[README.md](./README.md)
- 查看项目详情：[PROJECT_README.md](./PROJECT_README.md)

---

Happy Coding! 🎉
