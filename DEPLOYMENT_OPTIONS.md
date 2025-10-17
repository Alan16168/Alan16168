# 🚀 BC省房东管理系统 - 部署选项

## 当前状态

✅ **代码开发完成** - 所有功能已实现  
✅ **依赖已安装** - 前后端npm包已安装  
⚠️ **需要配置** - MongoDB和OpenAI API密钥

---

## 📋 部署前检查清单

### 已完成 ✅
- [x] 后端代码 (Node.js + Express)
- [x] 前端代码 (React + Vite)
- [x] 后端依赖安装 (467 packages)
- [x] 前端依赖安装 (359 packages)
- [x] 环境配置文件 (.env)
- [x] 所有文档

### 需要配置 ⚠️
- [ ] MongoDB数据库
- [ ] OpenAI API密钥
- [ ] 启动服务

---

## 🎯 部署选项

### 选项 1: 使用 MongoDB Atlas（推荐）✨

**优点**: 免费、云端、无需本地安装

#### 步骤：

1. **注册 MongoDB Atlas**
   ```
   访问: https://www.mongodb.com/cloud/atlas/register
   创建免费账户
   ```

2. **创建免费集群**
   - 选择 "Build a Database"
   - 选择 "Free" (M0) 计划
   - 选择离你最近的区域
   - 点击 "Create"

3. **获取连接字符串**
   - 创建数据库用户
   - 添加 IP 白名单 (0.0.0.0/0 允许所有)
   - 点击 "Connect" → "Connect your application"
   - 复制连接字符串

4. **配置环境变量**
   ```bash
   cd /home/user/webapp/backend
   nano .env
   ```
   
   修改：
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.xxx.mongodb.net/bc-landlord-manager
   OPENAI_API_KEY=sk-你的OpenAI密钥
   ```

5. **启动应用**
   ```bash
   cd /home/user/webapp
   
   # 终端1 - 后端
   cd backend && npm run dev
   
   # 终端2 - 前端
   cd frontend && npm run dev
   ```

---

### 选项 2: 使用本地 MongoDB

**需要**: 本地安装MongoDB或Docker

#### 使用 Docker (如果可用):
```bash
docker run -d \
  --name bc-landlord-mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest
```

#### 使用本地 MongoDB:
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb-org

# macOS
brew install mongodb-community

# 启动
sudo systemctl start mongod
# 或
mongod --dbpath /path/to/data
```

然后启动应用（同上）

---

### 选项 3: 使用在线 MongoDB 服务

其他云MongoDB服务：
- **Railway**: https://railway.app/ (免费)
- **Render**: https://render.com/ (免费)
- **Fly.io**: https://fly.io/ (免费)

---

## 🔑 获取 OpenAI API 密钥

### 步骤：

1. **访问 OpenAI 平台**
   ```
   https://platform.openai.com/signup
   ```

2. **注册或登录**

3. **创建 API 密钥**
   - 进入: https://platform.openai.com/api-keys
   - 点击 "Create new secret key"
   - 复制密钥（只显示一次！）

4. **充值账户**
   - 进入: https://platform.openai.com/account/billing
   - 至少充值 $5

5. **配置到系统**
   ```bash
   cd /home/user/webapp/backend
   nano .env
   ```
   
   修改：
   ```env
   OPENAI_API_KEY=sk-你刚才复制的密钥
   ```

---

## 🚀 启动应用

### 方法 1: 使用启动脚本（简单）

```bash
cd /home/user/webapp
chmod +x start-dev.sh
./start-dev.sh
```

### 方法 2: 手动启动（分步）

**终端 1 - 后端:**
```bash
cd /home/user/webapp/backend
npm run dev
```

看到以下输出说明成功：
```
🚀 Server running on port 5000
📍 Environment: development
✅ MongoDB Connected
```

**终端 2 - 前端:**
```bash
cd /home/user/webapp/frontend
npm run dev
```

看到：
```
  ➜  Local:   http://localhost:3000/
```

---

## ✅ 验证部署

### 1. 测试后端
```bash
curl http://localhost:5000/api/health
```

应该返回：
```json
{
  "status": "OK",
  "message": "BC Landlord Manager API is running",
  "timestamp": "2025-10-17T..."
}
```

### 2. 访问前端
打开浏览器访问：**http://localhost:3000**

应该看到登录界面。

### 3. 创建管理员
```bash
cd /home/user/webapp/scripts
npm install
node create-admin.js
```

### 4. 登录测试
使用管理员账户登录系统。

---

## 🌐 获取公网访问地址

如果你想从外部访问这个沙盒环境中的应用：

```bash
# 使用 GetServiceUrl 工具获取公网地址
# 这会返回一个可以从浏览器访问的URL
```

---

## 📊 当前系统信息

```
项目路径: /home/user/webapp
后端端口: 5000
前端端口: 3000

已安装:
- 后端依赖: 467 packages
- 前端依赖: 359 packages
- 代码行数: 3,388 lines

未配置:
- MongoDB连接
- OpenAI API密钥
```

---

## 🆘 需要帮助？

### 常见问题：

**Q: 没有 OpenAI API 密钥怎么办？**
A: 你需要注册OpenAI账户并充值。这是使用AI功能的必需条件。

**Q: 没有 MongoDB 怎么办？**
A: 使用 MongoDB Atlas 免费版（推荐），或者安装本地MongoDB。

**Q: 可以跳过这些配置吗？**
A: 不行。没有MongoDB系统无法存储数据，没有OpenAI密钥AI功能无法工作。

**Q: 我想看演示怎么办？**
A: 你需要完成MongoDB和OpenAI的配置后才能运行。

---

## 💡 推荐部署流程

**最简单的方式（15分钟）：**

1. ✅ 注册 MongoDB Atlas（5分钟）
2. ✅ 注册 OpenAI 并获取API密钥（5分钟）
3. ✅ 配置 .env 文件（1分钟）
4. ✅ 启动应用（1分钟）
5. ✅ 创建管理员（1分钟）
6. ✅ 开始使用！

---

## 📞 联系支持

如果你在部署过程中遇到问题：
- 📧 邮箱: alan@alandeng.ca
- 📖 查看: `INSTALLATION_GUIDE.md`

---

**下一步**: 选择一个部署选项并开始配置！🚀
