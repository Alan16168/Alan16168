# OpenAI API 配额充值指南

## 🔗 快速链接

### 主要页面

- **账单总览**: https://platform.openai.com/account/billing/overview
- **使用情况**: https://platform.openai.com/account/usage  
- **API Keys**: https://platform.openai.com/api-keys
- **组织设置**: https://platform.openai.com/account/organization

## 📋 充值步骤

### 1️⃣ 访问账单页面

访问: https://platform.openai.com/account/billing/overview

### 2️⃣ 添加支付方式

1. 点击 **"Add payment details"** 或 **"Add to credit balance"**
2. 输入信用卡信息（支持 Visa, Mastercard, American Express）
3. 确认账单地址

### 3️⃣ 充值余额

**推荐充值金额**：

| 用途 | 建议金额 | 预计使用量 |
|------|---------|-----------|
| 🧪 测试 | $5-10 USD | 500-1000 次对话 |
| 🏢 小型生产 | $50-100 USD | 5,000-10,000 次对话 |
| 🚀 企业级 | $200+ USD | 20,000+ 次对话 |

### 4️⃣ 设置使用限额（强烈推荐）

保护您的账户免受意外高额费用：

1. 在 Billing 页面找到 **"Usage limits"**
2. 设置 **"Monthly budget"**（每月预算）
   - 推荐：$50-100 USD
3. 设置 **"Email alerts"**（邮件提醒）
   - 推荐：50%, 75%, 90%

### 5️⃣ 验证配额状态

访问: https://platform.openai.com/account/usage

确认：
- ✅ Credit balance > $0
- ✅ Usage limits 已设置
- ✅ API Key 有效

## 💰 成本预估

### GPT-4o 定价（2024-10 最新）

| 类型 | 价格 |
|------|------|
| 输入 Token | $2.50 / 1M tokens |
| 输出 Token | $10.00 / 1M tokens |
| Embeddings | $0.02 / 1M tokens |

### 实际使用成本

**典型对话成本**：
- 简单问答（~200 tokens）：约 $0.002-0.005
- 中等回答（~500 tokens）：约 $0.005-0.015
- 详细回答（~1000 tokens）：约 $0.01-0.03

**批量使用**：
- 100 次对话：约 $1-3 USD
- 1,000 次对话：约 $10-30 USD
- 10,000 次对话：约 $100-300 USD

### BC 房东管理系统预估

基于我们的 RAG 系统：
- 每次查询约使用 1,500-3,000 tokens（包含文档上下文）
- 预计每次对话成本：$0.015-0.045
- $50 可支持约 1,000-3,000 次对话

## 🔧 当前系统配置

### API 配置
```
API Key: sk-proj-Qf-UDL... (已隐藏)
模型: gpt-4o
Embedding: text-embedding-3-small
```

### 环境文件位置
```
/home/user/webapp/backend/.env
```

## ✅ 充值完成后

### 立即测试

运行自动测试脚本：

```bash
cd /home/user/webapp
./test-openai-quota.sh
```

或手动测试：

```bash
# 1. 登录
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"demo123456"}' | jq -r '.token')

# 2. 测试 AI 聊天
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message": "在BC省，租客可以养宠物吗？", "sessionId": "test-123", "language": "zh"}'
```

### 预期结果

如果配额充足，您应该看到：

```json
{
  "success": true,
  "response": "根据BC省的租赁法律...",
  "conversationId": "...",
  "fromKnowledgeBase": false,
  "timestamp": "..."
}
```

## 🆘 常见问题

### Q: 充值后多久生效？
A: 通常立即生效，最多等待 1-2 分钟

### Q: 如何检查剩余额度？
A: 访问 https://platform.openai.com/account/usage

### Q: API 429 错误如何解决？
A: 这是配额不足错误，需要充值或等待配额重置

### Q: 如何防止超支？
A: 在 Billing 页面设置每月预算限额（Usage limits）

### Q: 支持哪些支付方式？
A: 信用卡（Visa, Mastercard, American Express）

### Q: 费用如何计费？
A: 按实际 token 使用量计费，每月结算

## 📞 需要帮助？

- OpenAI 官方文档: https://platform.openai.com/docs
- OpenAI 支持: https://help.openai.com
- 价格详情: https://openai.com/pricing

---

**准备好了吗？** 

1. ✅ 访问充值页面
2. ✅ 添加支付方式
3. ✅ 充值余额
4. ✅ 设置使用限额
5. ✅ 运行测试脚本

充值完成后，告诉我，我将立即为您测试真实的 GPT-4 响应！🚀
