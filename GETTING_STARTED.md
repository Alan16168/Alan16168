# 🚀 开始使用 BC省房东管理系统

## 欢迎！

恭喜！你现在拥有一个功能完整的BC省房东管理系统。让我们用**3个简单步骤**让它运行起来。

---

## ⚡ 快速开始（3步骤）

### 步骤 1: 安装依赖

```bash
cd /home/user/webapp

# 安装后端依赖
cd backend && npm install

# 安装前端依赖
cd ../frontend && npm install

# 返回根目录
cd ..
```

### 步骤 2: 配置环境

```bash
# 后端已经有 .env 文件，但你需要添加 OpenAI API 密钥
nano backend/.env
```

**最重要的配置：**
```env
OPENAI_API_KEY=sk-你的OpenAI-API密钥
```

💡 **获取 OpenAI API 密钥:**
1. 访问: https://platform.openai.com/api-keys
2. 登录或注册账号
3. 创建新的 API 密钥
4. 复制并粘贴到 .env 文件中

### 步骤 3: 启动系统

```bash
# 使用一键启动脚本
./start-dev.sh
```

或者手动启动：

```bash
# 终端 1 - 启动 MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 终端 2 - 启动后端
cd backend && npm run dev

# 终端 3 - 启动前端
cd frontend && npm run dev
```

🎉 **完成！** 打开浏览器访问：**http://localhost:3000**

---

## 👤 创建管理员账户

系统启动后，你需要一个管理员账户：

```bash
cd scripts
npm install
node create-admin.js
```

这会创建默认管理员：
- 📧 邮箱: `admin@example.com`
- 🔑 密码: `admin123456`

或者自定义：
```bash
node create-admin.js your@email.com YourPassword123 "Your Name"
```

---

## 📤 上传知识库文档

为了让 AI 助手工作，你需要上传 7 个文档：

### 1. 准备文档

将这些文档放入 `documents` 文件夹：

```bash
mkdir -p documents
```

需要的文档：
1. BC RTA.docx
2. BC RESIDENTIAL TENANCY REGULATION.docx
3. rtb1_chrome.docx
4. Converting to Excel To Word_房屋维护表.docx
5. 加拿大BC省出租管理电话.docx
6. 加拿大BC省房屋维护指南.docx
7. BC省民用住宅出租管理完全手册.docx

### 2. 获取管理员Token

1. 使用管理员账户登录系统
2. 按 F12 打开浏览器开发者工具
3. 切换到 **Network** 标签
4. 点击任意页面（触发 API 请求）
5. 找到任意 API 请求，查看 **Request Headers**
6. 复制 `Authorization: Bearer` 后面的 token

### 3. 上传文档

```bash
cd scripts
node upload-documents.js YOUR_TOKEN_HERE ../documents
```

示例：
```bash
node upload-documents.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY... ../documents
```

---

## ✅ 验证安装

### 测试后端
```bash
curl http://localhost:5000/api/health
```

应该返回：
```json
{
  "status": "OK",
  "message": "BC Landlord Manager API is running"
}
```

### 测试前端
打开浏览器访问 http://localhost:3000，应该看到登录页面。

### 测试 AI 助手
1. 使用管理员账户登录
2. 进入 "AI助手" 页面
3. 提问：`如何合法提高租金？`
4. 如果能看到回答和文档来源，说明一切正常！✅

---

## 📚 常用功能

### 功能 1: AI 智能问答
- 进入 "AI助手" 页面
- 用中文或英文提问
- 系统会基于 BC 省文档回答
- 显示相关文档来源和相关性

### 功能 2: 下载表格
- 进入 "表格下载" 页面
- 浏览 8 个 BC 省官方表格
- 查看详细说明和使用场景
- 点击下载按钮获取 PDF

### 功能 3: 租客背景调查
- 需要高级用户或管理员权限
- 进入 "背景调查" 页面
- 填写租客信息
- 提交申请
- 查看历史记录

### 功能 4: 切换语言
- 点击左下角的语言按钮
- 在英文和中文之间切换
- 所有界面实时更新

---

## 🔧 常见问题

### Q: MongoDB 连接失败？
**A:** 确保 MongoDB 正在运行：
```bash
docker ps | grep mongo
# 如果没有，启动它：
docker start mongodb
```

### Q: OpenAI API 报错？
**A:** 检查两件事：
1. API 密钥是否正确
2. 账户是否有余额：https://platform.openai.com/account/billing

### Q: 端口被占用？
**A:** 更改端口：
```bash
# 编辑 backend/.env
PORT=5001

# 编辑 frontend/vite.config.js
server: { port: 3001 }
```

### Q: 前端无法连接后端？
**A:** 确认后端正在运行：
```bash
curl http://localhost:5000/api/health
```

---

## 📖 更多文档

- **快速开始**: `QUICK_START.md` - 5分钟快速入门
- **安装指南**: `INSTALLATION_GUIDE.md` - 详细安装步骤
- **项目文档**: `PROJECT_README.md` - 技术细节
- **完整说明**: `README.md` - 项目概述

---

## 🎯 下一步

安装成功后，建议：

1. ✅ 修改管理员密码
2. ✅ 创建测试用户账户
3. ✅ 测试所有功能
4. ✅ 上传知识库文档
5. ✅ 阅读详细文档
6. ✅ 自定义配置

---

## 💡 提示

- 💾 定期备份 MongoDB 数据
- 🔐 生产环境使用强密码
- 🔒 启用 HTTPS
- 📊 监控 OpenAI API 使用量
- 🐛 遇到问题查看日志

---

## 📞 需要帮助？

- 📧 邮箱: alan@alandeng.ca
- 📖 查看文档: `INSTALLATION_GUIDE.md`
- 🐛 检查日志: `docker logs mongodb`

---

**祝您使用愉快！🎉**

如果系统对您有帮助，别忘了给个⭐！
