# 🚀 BC房东管理系统 - 快速开始指南

**系统状态**: ✅ 完全运行中  
**模式**: 生产环境（真实 AI）  
**最后更新**: 2025-10-19

---

## 📍 访问地址

### 🖥️ 前端应用
**URL**: https://3003-i75t2b5146b2ag3brd419-ad490db5.sandbox.novita.ai

这是你的主要用户界面，可以：
- 📝 登录系统
- 💬 与AI聊天（基于RAG的智能问答）
- 📄 上传和管理文档
- 📋 管理租赁表格
- 🔍 进行背景调查（Mock模式）

### 🔧 后端API
**URL**: https://5000-i75t2b5146b2ag3brd419-ad490db5.sandbox.novita.ai

API端点：
- `/api/health` - 健康检查
- `/api/auth/login` - 用户登录
- `/api/chat/message` - AI聊天（带RAG）
- `/api/documents` - 文档管理
- `/api/forms` - 表格管理

---

## 🔐 登录信息

### 演示账户
- **邮箱**: `admin@demo.com`
- **密码**: `demo123456`
- **角色**: 管理员

---

## 💡 如何使用 RAG 聊天功能

### 方法1：通过前端界面（推荐）

1. **打开前端应用**
   ```
   https://3003-i75t2b5146b2ag3brd419-ad490db5.sandbox.novita.ai
   ```

2. **登录**
   - 输入邮箱: `admin@demo.com`
   - 输入密码: `demo123456`

3. **进入聊天界面**
   - 找到"AI助手"或"聊天"页面

4. **开始提问**
   
   试试这些问题（系统已有答案）：
   
   ✅ **关于押金**:
   ```
   在BC省，房东可以收多少押金？
   ```
   
   ✅ **关于宠物**:
   ```
   BC省的租客可以养宠物吗？房东能禁止吗？
   ```
   
   ✅ **关于租金上涨**:
   ```
   房东想涨租金，需要提前多久通知我？
   ```

5. **查看回答**
   - AI会引用具体的文档来源
   - 回答基于上传的BC住宅租赁法文档
   - 如果文档中没有相关信息，AI会明确说明

---

### 方法2：直接调用API（测试用）

#### 步骤1：获取认证Token

```bash
curl -X POST https://5000-i75t2b5146b2ag3brd419-ad490db5.sandbox.novita.ai/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"demo123456"}'
```

**响应示例**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

#### 步骤2：发送聊天请求

```bash
# 替换 YOUR_TOKEN 为上一步获得的 token
curl -X POST https://5000-i75t2b5146b2ag3brd419-ad490db5.sandbox.novita.ai/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "在BC省，房东可以收多少押金？",
    "sessionId": "test-session",
    "language": "zh"
  }'
```

**响应示例**:
```json
{
  "success": true,
  "message": "根据BC省的《住宅租赁法》，房东可以收取的押金金额不得超过一个月的租金...",
  "sources": [
    {
      "documentName": "BC住宅租赁法-押金规定.txt",
      "category": "RTA",
      "excerpt": "第1条：押金上限...",
      "relevanceScore": 0.89
    }
  ],
  "isFromKnowledgeBase": true,
  "sessionId": "test-session"
}
```

---

## 📚 当前知识库内容

系统已上传以下3个文档（共9个文本块）：

1. **BC住宅租赁法-宠物政策.txt** (2个块)
   - 宠物许可政策
   - 宠物押金规定
   - 服务动物规定
   - 禁止宠物的限制

2. **BC住宅租赁法-押金规定.txt** (3个块)
   - 押金上限（最多1个月租金）
   - 押金利息要求
   - 押金退还时限
   - 允许扣除的情况

3. **BC住宅租赁法-租金上涨.txt** (4个块)
   - 涨租频率（每年最多1次）
   - 通知要求（至少3个月）
   - 年度涨幅上限
   - 额外涨租申请流程

---

## 🧪 快速测试

### 自动化测试脚本

```bash
# 在服务器上运行完整测试
cd /home/user/webapp
bash test-rag-functionality.sh
```

这个脚本会：
- ✅ 自动登录
- ✅ 测试3个不同的问题
- ✅ 验证RAG检索功能
- ✅ 显示详细的测试结果

---

## 🎯 RAG工作原理

```mermaid
用户提问
    ↓
生成问题的向量（Embedding）
    ↓
在文档库中搜索相似内容（余弦相似度）
    ↓
找到最相关的文档片段（Top 5）
    ↓
将文档片段 + 问题发送给 GPT-4o
    ↓
GPT-4o 生成基于文档的回答
    ↓
返回答案 + 引用来源
```

### 技术栈
- **Embedding模型**: OpenAI text-embedding-3-small (1536维)
- **LLM模型**: OpenAI GPT-4o
- **相似度算法**: 余弦相似度（Cosine Similarity）
- **检索数量**: Top 5最相关的文档块
- **响应时间**: 约3-7秒

---

## 📊 系统功能

| 功能 | 状态 | 说明 |
|------|------|------|
| 用户认证 | ✅ 启用 | JWT token，7天有效期 |
| AI聊天 | ✅ 启用 | 真实GPT-4o响应 |
| RAG检索 | ✅ 启用 | 基于文档的智能回答 |
| 文档管理 | ✅ 启用 | 上传、查看、删除文档 |
| 表格管理 | ✅ 启用 | 租赁协议表格 |
| 背景调查 | ⚠️ Mock | 模拟数据 |

---

## 🔧 本地开发命令

### 启动服务

```bash
# 后端（已在运行）
cd /home/user/webapp/backend
node src/server-production.js

# 前端（已在运行）
cd /home/user/webapp/frontend
npm run dev
```

### 上传新文档

```bash
cd /home/user/webapp/backend
node -r dotenv/config upload-sample-docs.js
```

### 查看数据库内容

```bash
cd /home/user/webapp/backend
node -r dotenv/config << 'EOF'
const mongoose = require('mongoose');
const Document = require('./models/Document.model');

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:45749/');
  const docs = await Document.find({});
  console.log(`文档数量: ${docs.length}`);
  docs.forEach(d => console.log(`- ${d.originalName}`));
  await mongoose.disconnect();
}
check();
EOF
```

---

## ⚠️ 重要提醒

### 内存数据库限制
- 服务器重启后，MongoDB会创建新的数据库实例
- 所有文档会丢失，需要重新上传
- **建议**: 正式环境切换到持久化MongoDB（MongoDB Atlas或Docker）

### API配额
- **GPT-4o**: 已充值，正常使用
- **Embedding**: 已充值$5，可支持500万次查询
- **成本**: Embedding只占总成本的0.004%

---

## 📖 更多文档

- `RAG_SYSTEM_SUCCESS_REPORT.md` - 完整的系统文档
- `EMBEDDING_COST_ANALYSIS.md` - 成本分析
- `OPENAI_BILLING_GUIDE.md` - OpenAI充值指南

---

## 🆘 遇到问题？

### 登录失败
- 确认密码是 `demo123456`（不是 `Admin123456`）
- 检查邮箱是 `admin@demo.com`

### 找不到文档来源
- 运行测试脚本验证文档是否在数据库中
- 可能需要重新上传文档

### 聊天无响应
- 检查后端API健康状态: `curl http://localhost:5000/api/health`
- 查看浏览器控制台错误信息

### 服务器无法访问
- 前端: https://3003-i75t2b5146b2ag3brd419-ad490db5.sandbox.novita.ai
- 后端: https://5000-i75t2b5146b2ag3brd419-ad490db5.sandbox.novita.ai

---

## 🎉 开始使用

**现在就访问**:  
👉 https://3003-i75t2b5146b2ag3brd419-ad490db5.sandbox.novita.ai

用 `admin@demo.com` / `demo123456` 登录，开始体验智能RAG问答系统！

---

**祝使用愉快！** 🚀
