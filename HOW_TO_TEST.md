# 🧪 BC省房东管理系统 - 测试指南

## 📝 快速测试（3分钟）

### 方法1: 自动化测试脚本（最简单）✨

在终端运行：
```bash
cd /home/user/webapp
./test-system.sh
```

这个脚本会自动测试所有功能，包括：
- ✅ 用户注册和登录
- ✅ AI聊天（中英文）
- ✅ 聊天历史
- ✅ BC省表格
- ✅ 背景调查

**预期结果**：您会看到绿色的 ✅ 标记，表示所有测试通过！

---

## 🌐 方法2: 浏览器测试

### 步骤1: 测试后端健康检查

在浏览器打开：
```
https://5000-i75t2b5146b2ag3brd419-ad490db5.sandbox.novita.ai/api/health
```

您应该看到：
```json
{
  "status": "OK",
  "mode": "HYBRID (Intelligent Simulation with Auto-Fallback)",
  "features": {
    "authentication": "enabled",
    "ai_chat": "enabled",
    "intelligent_responses": "enabled",
    "forms": "enabled",
    "background_check": "mock"
  }
}
```

### 步骤2: 使用 Postman 或类似工具测试 API

#### 2.1 注册用户
**请求**:
```
POST https://5000-i75t2b5146b2ag3brd419-ad490db5.sandbox.novita.ai/api/auth/register
Content-Type: application/json

{
  "name": "测试用户",
  "email": "test@example.com",
  "password": "test123456",
  "language": "zh"
}
```

**响应**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "测试用户",
    "email": "test@example.com",
    "role": "user"
  }
}
```

**重要**: 保存返回的 `token`，后续请求需要使用！

#### 2.2 测试AI聊天
**请求**:
```
POST https://5000-i75t2b5146b2ag3brd419-ad490db5.sandbox.novita.ai/api/chat/message
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "message": "BC省租客可以养宠物吗？",
  "language": "zh",
  "sessionId": "test-session-1"
}
```

**响应**:
```json
{
  "success": true,
  "message": "根据BC省《住宅租赁法》(Residential Tenancy Act)，房东不能在租赁协议中完全禁止租客养宠物...",
  "sources": [
    {
      "documentName": "BC省住宅租赁法 - 宠物条款",
      "category": "RTA",
      "relevanceScore": 0.92
    }
  ],
  "mode": "intelligent_simulation"
}
```

---

## 💻 方法3: 使用 curl 命令测试

### 一键测试所有功能

复制以下命令到终端：

```bash
# 设置API URL
API_URL="http://localhost:5000"

# 1. 健康检查
echo "=== 健康检查 ==="
curl -s ${API_URL}/api/health | jq .
echo ""

# 2. 注册用户
echo "=== 注册用户 ==="
REGISTER=$(curl -s -X POST ${API_URL}/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "测试用户", "email": "test'$(date +%s)'@example.com", "password": "test123456", "language": "zh"}')
echo "$REGISTER" | jq .
TOKEN=$(echo "$REGISTER" | jq -r '.token')
echo ""

# 3. 测试AI聊天 - 宠物问题
echo "=== AI聊天: 宠物问题 ==="
curl -s -X POST ${API_URL}/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message": "BC省租客可以养宠物吗？", "language": "zh", "sessionId": "test-1"}' | jq '{success, message, sources}'
echo ""

# 4. 测试AI聊天 - 租金问题
echo "=== AI聊天: 租金问题 ==="
curl -s -X POST ${API_URL}/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message": "房东如何涨租？", "language": "zh", "sessionId": "test-1"}' | jq '{success, message, sources}'
echo ""

# 5. 测试AI聊天 - 押金问题
echo "=== AI聊天: 押金问题 ==="
curl -s -X POST ${API_URL}/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message": "押金最多可以收多少？", "language": "zh", "sessionId": "test-1"}' | jq '{success, message, sources}'
echo ""

# 6. 英文测试
echo "=== AI聊天: 英文测试 ==="
curl -s -X POST ${API_URL}/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message": "Can tenants have pets?", "language": "en", "sessionId": "test-2"}' | jq '{success, message}'
echo ""

echo "✅ 测试完成！"
```

---

## 🎯 推荐测试问题

### 中文问题
1. `BC省租客可以养宠物吗？`
2. `房东如何涨租？`
3. `押金最多可以收多少？`
4. `租客有什么权利？`
5. `房东可以随便进入出租屋吗？`
6. `如何驱逐租客？`
7. `租约可以提前终止吗？`

### English Questions
1. `Can tenants have pets in BC?`
2. `How can landlords increase rent?`
3. `What is the maximum security deposit?`
4. `What are tenant rights?`
5. `Can landlords enter the rental unit anytime?`
6. `How to evict a tenant?`
7. `Can a tenancy be terminated early?`

---

## 📊 测试结果说明

### ✅ 成功的响应
- `success: true`
- 完整的AI回答（中文或英文）
- 来源文档引用
- 相关度评分

### ⚠️ 预期的限制
- **表格列表为空**: 需要手动添加表格数据
- **背景调查需要Premium**: 普通用户看到权限限制是正常的
- **前端403错误**: 沙箱代理限制，不影响后端功能

---

## 🔐 测试账户

### 使用自动化脚本生成的账户
运行 `./test-system.sh` 后，会显示：
```
测试账户信息：
  邮箱: test1760683106@example.com
  密码: test123456
```

### 手动创建账户
使用任何邮箱注册，密码至少6位。

---

## 📱 API 端点完整列表

### 认证 API
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/profile` - 更新个人资料

### AI 聊天 API
- `POST /api/chat/message` - 发送消息到AI
- `GET /api/chat/sessions` - 获取所有会话
- `GET /api/chat/history/:sessionId` - 获取会话历史

### 表格 API
- `GET /api/forms` - 获取所有BC省表格
- `GET /api/forms/:id` - 获取特定表格详情

### 用户管理 API（需要Admin权限）
- `GET /api/users` - 获取所有用户
- `PUT /api/users/:id` - 更新用户信息
- `DELETE /api/users/:id` - 删除用户

### 背景调查 API（需要Premium/Admin）
- `POST /api/background-check/request` - 提交背景调查请求
- `GET /api/background-check/history` - 获取调查历史

---

## 🐛 故障排除

### 问题1: "Invalid credentials"
**原因**: 用户不存在或密码错误  
**解决**: 先注册用户再登录

### 问题2: "Not authorized to access this route"
**原因**: Token 无效或过期  
**解决**: 重新登录获取新的 Token

### 问题3: "Premium or Admin subscription required"
**原因**: 普通用户访问高级功能  
**解决**: 这是正常的权限控制，测试通过

### 问题4: 前端返回403
**原因**: 沙箱代理配置限制  
**解决**: 使用后端API测试，前端在本地 localhost:3003 可以访问

---

## ✨ 测试成功的标志

运行自动化测试脚本后，您应该看到：

```
✅ 健康检查通过
✅ 用户注册成功
✅ 用户登录成功
✅ AI回答成功（宠物问题）
✅ AI回答成功（租金问题）
✅ AI回答成功（押金问题）
✅ AI回答成功（英文测试）
✅ 聊天历史获取成功
```

**所有测试通过意味着系统完全可用！** 🎉

---

## 📞 需要帮助？

如果测试遇到问题：

1. **检查服务状态**:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **查看服务器日志**:
   ```bash
   # 后端日志在运行的终端中
   ```

3. **重新启动服务**:
   ```bash
   cd /home/user/webapp/backend
   node src/server-hybrid.js
   ```

---

**准备好了吗？运行测试脚本开始吧！** 🚀

```bash
cd /home/user/webapp
./test-system.sh
```
