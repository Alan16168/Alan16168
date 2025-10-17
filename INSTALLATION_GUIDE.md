# BC省房东管理系统 - 完整安装指南

## 📋 目录

1. [系统要求](#系统要求)
2. [快速安装](#快速安装)
3. [详细安装步骤](#详细安装步骤)
4. [配置说明](#配置说明)
5. [初始化系统](#初始化系统)
6. [启动应用](#启动应用)
7. [验证安装](#验证安装)
8. [故障排除](#故障排除)

---

## 系统要求

### 必需软件
- **Node.js**: >= 18.0.0
- **MongoDB**: >= 5.0
- **NPM**: >= 9.0.0

### 推荐环境
- **操作系统**: Linux / macOS / Windows WSL2
- **内存**: >= 4GB RAM
- **磁盘**: >= 5GB 可用空间

### API密钥
- **OpenAI API Key**: 需要有效的OpenAI API密钥
  - 注册地址: https://platform.openai.com/signup
  - 确保账户有充足余额

---

## 快速安装

### 方法1: 使用自动安装脚本 (推荐)

```bash
cd /home/user/webapp
chmod +x start-dev.sh
./start-dev.sh
```

脚本会自动：
- ✅ 检查依赖
- ✅ 安装npm包
- ✅ 启动MongoDB (Docker)
- ✅ 启动后端和前端服务

### 方法2: 使用Docker Compose

```bash
cd /home/user/webapp

# 设置环境变量
export OPENAI_API_KEY=sk-your-api-key-here
export JWT_SECRET=your-secret-key

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

---

## 详细安装步骤

### 步骤1: 克隆或下载项目

```bash
cd /home/user
# 项目已经在 /home/user/webapp
cd webapp
```

### 步骤2: 安装后端依赖

```bash
cd backend
npm install
```

预期输出：
```
added XXX packages in XXs
```

### 步骤3: 安装前端依赖

```bash
cd ../frontend
npm install
```

### 步骤4: 安装脚本依赖

```bash
cd ../scripts
npm install
```

### 步骤5: 配置环境变量

```bash
cd ../backend

# 如果不存在.env文件，从示例创建
cp .env.example .env

# 编辑.env文件
nano .env
# 或
vim .env
```

**必须修改的配置：**
```env
# MongoDB连接 (如果使用默认本地MongoDB则无需修改)
MONGODB_URI=mongodb://localhost:27017/bc-landlord-manager

# JWT密钥 (强烈建议修改！)
JWT_SECRET=请-更改-为-你-自己-的-超-长-密-钥-12345

# OpenAI API密钥 (必须填写！)
OPENAI_API_KEY=sk-your-real-openai-api-key-here
```

### 步骤6: 启动MongoDB

**选项A: 使用Docker (推荐)**
```bash
docker run -d \
  --name bc-landlord-mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest
```

**选项B: 使用本地MongoDB**
```bash
# 启动MongoDB服务
sudo systemctl start mongod

# 或手动启动
mongod --dbpath /path/to/data/db
```

**验证MongoDB运行**
```bash
mongosh
# 如果成功连接，说明MongoDB正在运行
```

---

## 配置说明

### 环境变量详解

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `PORT` | 后端服务端口 | 5000 | 否 |
| `NODE_ENV` | 运行环境 | development | 否 |
| `MONGODB_URI` | MongoDB连接字符串 | mongodb://localhost:27017/bc-landlord-manager | 是 |
| `JWT_SECRET` | JWT签名密钥 | - | 是 |
| `JWT_EXPIRE` | Token过期时间 | 7d | 否 |
| `OPENAI_API_KEY` | OpenAI API密钥 | - | 是 |
| `OPENAI_MODEL` | 使用的GPT模型 | gpt-4-turbo-preview | 否 |
| `FRONTEND_URL` | 前端URL (CORS) | http://localhost:3000 | 否 |

### OpenAI模型选择

支持的模型：
- `gpt-4-turbo-preview` (推荐，最新最强)
- `gpt-4` (稳定版)
- `gpt-3.5-turbo` (经济实惠)

---

## 初始化系统

### 1. 创建管理员账户

```bash
cd scripts

# 使用默认值创建
npm run create-admin

# 或指定自定义信息
node create-admin.js admin@mydomain.com MySecurePass123 "Admin Name"
```

成功输出示例：
```
✅ 管理员账户创建成功！
========================================
📧 邮箱: admin@mydomain.com
🔑 密码: MySecurePass123
👤 姓名: Admin Name
🎯 角色: admin
========================================
```

⚠️ **重要**: 请妥善保管管理员密码！

### 2. 准备知识库文档

将以下7个文档放入 `documents` 目录：

```bash
mkdir -p documents
```

需要的文档：
1. ✅ BC RTA.docx
2. ✅ BC RESIDENTIAL TENANCY REGULATION.docx
3. ✅ rtb1_chrome.docx
4. ✅ Converting to Excel To Word_房屋维护表.docx
5. ✅ 加拿大BC省出租管理电话.docx
6. ✅ 加拿大BC省房屋维护指南.docx
7. ✅ BC省民用住宅出租管理完全手册.docx

### 3. 上传文档到系统

```bash
cd scripts

# 步骤1: 启动应用 (在另一个终端)
cd /home/user/webapp
./start-dev.sh

# 步骤2: 获取管理员Token
# - 使用管理员账户登录 http://localhost:3000
# - 打开浏览器开发者工具 (F12)
# - 在Network标签找到任意API请求
# - 复制Authorization header中的token

# 步骤3: 上传文档
npm run upload-docs <YOUR_ADMIN_TOKEN> ../documents
```

示例：
```bash
node upload-documents.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ../documents
```

成功输出：
```
✅ 成功: 7
❌ 失败: 0
📝 总计: 7
🎉 文档上传完成！系统现在可以使用AI助手功能了。
```

---

## 启动应用

### 开发模式

**方法1: 使用启动脚本**
```bash
cd /home/user/webapp
./start-dev.sh
```

**方法2: 手动启动**

终端1 - 后端:
```bash
cd /home/user/webapp/backend
npm run dev
```

终端2 - 前端:
```bash
cd /home/user/webapp/frontend
npm run dev
```

### 生产模式

```bash
# 构建前端
cd frontend
npm run build

# 启动后端 (使用PM2)
cd ../backend
npm install -g pm2
pm2 start src/server.js --name bc-landlord-api

# 查看状态
pm2 status
pm2 logs bc-landlord-api
```

---

## 验证安装

### 1. 检查服务状态

**后端健康检查**
```bash
curl http://localhost:5000/api/health
```

预期响应：
```json
{
  "status": "OK",
  "message": "BC Landlord Manager API is running",
  "timestamp": "2025-10-17T..."
}
```

**MongoDB连接**
```bash
mongosh bc-landlord-manager
> db.users.countDocuments()
```

应该显示至少1个用户（管理员）

### 2. 访问前端

打开浏览器访问: **http://localhost:3000**

应该看到登录界面。

### 3. 测试登录

使用创建的管理员账户登录：
- 📧 邮箱: admin@mydomain.com
- 🔑 密码: (你设置的密码)

### 4. 测试AI助手

登录后进入"AI助手"页面，尝试提问：
- "如何合法提高租金？"
- "What is the notice period for ending a tenancy?"

如果能得到回答并显示文档来源，说明系统正常运行！

---

## 故障排除

### 问题1: MongoDB连接失败

**错误**: `MongoServerError: connect ECONNREFUSED 127.0.0.1:27017`

**解决方案**:
```bash
# 检查MongoDB是否运行
docker ps | grep mongo
# 或
ps aux | grep mongod

# 如果未运行，启动MongoDB
docker start bc-landlord-mongodb
# 或
sudo systemctl start mongod
```

### 问题2: OpenAI API错误

**错误**: `401 Unauthorized` 或 `429 Rate Limit`

**解决方案**:
1. 检查API密钥是否正确
   ```bash
   cat backend/.env | grep OPENAI_API_KEY
   ```

2. 验证API密钥有效性
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```

3. 检查账户余额: https://platform.openai.com/account/billing

### 问题3: 前端无法连接后端

**错误**: `Network Error` 或 `CORS Error`

**解决方案**:
1. 确认后端正在运行
   ```bash
   curl http://localhost:5000/api/health
   ```

2. 检查CORS配置
   ```bash
   cat backend/.env | grep FRONTEND_URL
   # 应该是: FRONTEND_URL=http://localhost:3000
   ```

3. 清除浏览器缓存并重试

### 问题4: 端口被占用

**错误**: `Error: listen EADDRINUSE: address already in use :::5000`

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :5000
# 或
netstat -tulpn | grep 5000

# 结束进程
kill -9 <PID>

# 或更改端口
# 编辑 backend/.env
PORT=5001
```

### 问题5: npm install失败

**错误**: 各种npm安装错误

**解决方案**:
```bash
# 清理npm缓存
npm cache clean --force

# 删除node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 如果还是失败，尝试使用yarn
npm install -g yarn
yarn install
```

### 问题6: 文档上传失败

**错误**: `Error processing document`

**解决方案**:
1. 检查文件格式是否为.docx
2. 确认文件大小 < 10MB
3. 验证管理员权限
4. 查看详细错误日志
   ```bash
   cd backend
   npm run dev
   # 查看控制台输出的详细错误
   ```

### 问题7: AI回答质量差

**问题**: AI回答不准确或没有引用文档

**解决方案**:
1. 确认文档已成功上传
   ```bash
   mongosh bc-landlord-manager
   > db.documents.countDocuments()
   # 应该显示7个文档
   ```

2. 检查文档是否有embeddings
   ```bash
   > db.documents.findOne({}, { 'chunks.embedding': 1 })
   # 应该显示embedding数组
   ```

3. 尝试更改OpenAI模型
   ```env
   # backend/.env
   OPENAI_MODEL=gpt-4  # 改为gpt-4
   ```

---

## 获取帮助

如果以上方法都无法解决问题：

1. **查看日志**
   ```bash
   # 后端日志
   cd backend && npm run dev
   
   # MongoDB日志
   docker logs bc-landlord-mongodb
   ```

2. **检查系统状态**
   ```bash
   # Node版本
   node -v
   
   # MongoDB版本
   mongosh --version
   
   # 磁盘空间
   df -h
   ```

3. **联系开发者**
   - 📧 邮箱: alan@alandeng.ca
   - 提供详细的错误信息和日志

---

## 下一步

安装成功后，建议：

1. ✅ 修改管理员密码
2. ✅ 创建测试用户账户
3. ✅ 测试所有功能
4. ✅ 配置生产环境
5. ✅ 设置自动备份
6. ✅ 配置SSL证书 (生产环境)

祝使用愉快！🎉
