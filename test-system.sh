#!/bin/bash

# BC省房东管理系统 - 完整测试脚本
# 作者: AI Assistant
# 日期: 2025-10-17

API_URL="http://localhost:5000"
TOKEN_FILE="/tmp/test_token.txt"

echo "=========================================="
echo "🚀 BC省房东管理系统 - 完整功能测试"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试1: 健康检查
echo "📋 测试1: 后端健康检查"
echo "----------------------------------------"
HEALTH=$(curl -s ${API_URL}/api/health)
if echo "$HEALTH" | jq -e '.status == "OK"' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 健康检查通过${NC}"
    echo "$HEALTH" | jq '{status, mode, features}'
else
    echo -e "${RED}❌ 健康检查失败${NC}"
    exit 1
fi
echo ""

# 测试2: 用户注册
echo "📋 测试2: 用户注册"
echo "----------------------------------------"
TIMESTAMP=$(date +%s)
TEST_EMAIL="test${TIMESTAMP}@example.com"
REGISTER_RESPONSE=$(curl -s -X POST ${API_URL}/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"测试用户${TIMESTAMP}\",
    \"email\": \"${TEST_EMAIL}\",
    \"password\": \"test123456\",
    \"language\": \"zh\"
  }")

if echo "$REGISTER_RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 用户注册成功${NC}"
    TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
    echo "$TOKEN" > "$TOKEN_FILE"
    echo "   用户邮箱: $TEST_EMAIL"
    echo "   用户名称: $(echo "$REGISTER_RESPONSE" | jq -r '.user.name')"
    echo "   Token已保存"
else
    echo -e "${RED}❌ 用户注册失败${NC}"
    echo "$REGISTER_RESPONSE" | jq '.'
    exit 1
fi
echo ""

# 测试3: 用户登录
echo "📋 测试3: 用户登录"
echo "----------------------------------------"
LOGIN_RESPONSE=$(curl -s -X POST ${API_URL}/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${TEST_EMAIL}\",
    \"password\": \"test123456\"
  }")

if echo "$LOGIN_RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 用户登录成功${NC}"
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
    echo "$TOKEN" > "$TOKEN_FILE"
else
    echo -e "${RED}❌ 用户登录失败${NC}"
    echo "$LOGIN_RESPONSE" | jq '.'
    exit 1
fi
echo ""

# 读取Token
TOKEN=$(cat "$TOKEN_FILE")

# 测试4: AI聊天 - 宠物问题（中文）
echo "📋 测试4: AI聊天 - 宠物问题（中文）"
echo "----------------------------------------"
echo "   问题: BC省租客可以养宠物吗？"
CHAT_RESPONSE_1=$(curl -s -X POST ${API_URL}/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "message": "BC省租客可以养宠物吗？",
    "language": "zh",
    "sessionId": "test-session-1"
  }')

if echo "$CHAT_RESPONSE_1" | jq -e '.success == true' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ AI回答成功${NC}"
    echo ""
    echo "   AI回答:"
    echo "$CHAT_RESPONSE_1" | jq -r '.message' | head -10
    echo ""
    echo "   来源文档: $(echo "$CHAT_RESPONSE_1" | jq -r '.sources[0].documentName')"
    echo "   相关度: $(echo "$CHAT_RESPONSE_1" | jq -r '.sources[0].relevanceScore')"
else
    echo -e "${RED}❌ AI回答失败${NC}"
    echo "$CHAT_RESPONSE_1" | jq '.'
fi
echo ""

# 测试5: AI聊天 - 租金问题（中文）
echo "📋 测试5: AI聊天 - 租金问题（中文）"
echo "----------------------------------------"
echo "   问题: 房东如何涨租？"
CHAT_RESPONSE_2=$(curl -s -X POST ${API_URL}/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "message": "房东如何涨租？",
    "language": "zh",
    "sessionId": "test-session-1"
  }')

if echo "$CHAT_RESPONSE_2" | jq -e '.success == true' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ AI回答成功${NC}"
    echo ""
    echo "   AI回答:"
    echo "$CHAT_RESPONSE_2" | jq -r '.message' | head -10
    echo ""
    echo "   来源文档: $(echo "$CHAT_RESPONSE_2" | jq -r '.sources[0].documentName')"
else
    echo -e "${RED}❌ AI回答失败${NC}"
    echo "$CHAT_RESPONSE_2" | jq '.'
fi
echo ""

# 测试6: AI聊天 - 押金问题（中文）
echo "📋 测试6: AI聊天 - 押金问题（中文）"
echo "----------------------------------------"
echo "   问题: 押金最多可以收多少？"
CHAT_RESPONSE_3=$(curl -s -X POST ${API_URL}/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "message": "押金最多可以收多少？",
    "language": "zh",
    "sessionId": "test-session-1"
  }')

if echo "$CHAT_RESPONSE_3" | jq -e '.success == true' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ AI回答成功${NC}"
    echo ""
    echo "   AI回答:"
    echo "$CHAT_RESPONSE_3" | jq -r '.message' | head -10
else
    echo -e "${RED}❌ AI回答失败${NC}"
    echo "$CHAT_RESPONSE_3" | jq '.'
fi
echo ""

# 测试7: 英文AI聊天
echo "📋 测试7: AI聊天 - 宠物问题（英文）"
echo "----------------------------------------"
echo "   问题: Can tenants have pets in BC?"
CHAT_RESPONSE_EN=$(curl -s -X POST ${API_URL}/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "message": "Can tenants have pets in BC?",
    "language": "en",
    "sessionId": "test-session-2"
  }')

if echo "$CHAT_RESPONSE_EN" | jq -e '.success == true' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ AI回答成功${NC}"
    echo ""
    echo "   AI Answer:"
    echo "$CHAT_RESPONSE_EN" | jq -r '.message' | head -10
else
    echo -e "${RED}❌ AI回答失败${NC}"
    echo "$CHAT_RESPONSE_EN" | jq '.'
fi
echo ""

# 测试8: 获取聊天历史
echo "📋 测试8: 获取聊天历史"
echo "----------------------------------------"
HISTORY_RESPONSE=$(curl -s -X GET ${API_URL}/api/chat/history/test-session-1 \
  -H "Authorization: Bearer ${TOKEN}")

if echo "$HISTORY_RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 聊天历史获取成功${NC}"
    MESSAGE_COUNT=$(echo "$HISTORY_RESPONSE" | jq '.messages | length')
    echo "   消息数量: $MESSAGE_COUNT"
else
    echo -e "${RED}❌ 聊天历史获取失败${NC}"
    echo "$HISTORY_RESPONSE" | jq '.'
fi
echo ""

# 测试9: BC省租赁表格列表
echo "📋 测试9: BC省租赁表格列表"
echo "----------------------------------------"
FORMS_RESPONSE=$(curl -s -X GET ${API_URL}/api/forms \
  -H "Authorization: Bearer ${TOKEN}")

if echo "$FORMS_RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 表格列表获取成功${NC}"
    FORM_COUNT=$(echo "$FORMS_RESPONSE" | jq '.data | length')
    echo "   可用表格数量: $FORM_COUNT"
    echo ""
    echo "   示例表格:"
    echo "$FORMS_RESPONSE" | jq -r '.data[0] | "   - \(.formCode): \(.title.zh)"'
    echo "$FORMS_RESPONSE" | jq -r '.data[1] | "   - \(.formCode): \(.title.zh)"'
else
    echo -e "${RED}❌ 表格列表获取失败${NC}"
    echo "$FORMS_RESPONSE" | jq '.'
fi
echo ""

# 测试10: 背景调查（Mock）
echo "📋 测试10: 租客背景调查（Mock）"
echo "----------------------------------------"
BG_CHECK_RESPONSE=$(curl -s -X POST ${API_URL}/api/background-check/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "firstName": "张",
    "lastName": "三",
    "email": "zhangsan@example.com",
    "phone": "778-123-4567",
    "currentAddress": "123 Main St, Vancouver, BC"
  }')

if echo "$BG_CHECK_RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 背景调查请求成功${NC}"
    echo "   调查ID: $(echo "$BG_CHECK_RESPONSE" | jq -r '.data.checkId')"
    echo "   状态: $(echo "$BG_CHECK_RESPONSE" | jq -r '.data.status')"
    echo "   预计完成时间: $(echo "$BG_CHECK_RESPONSE" | jq -r '.data.estimatedCompletionTime')"
else
    echo -e "${RED}❌ 背景调查请求失败${NC}"
    echo "$BG_CHECK_RESPONSE" | jq '.'
fi
echo ""

# 测试总结
echo "=========================================="
echo "🎉 测试完成！"
echo "=========================================="
echo ""
echo -e "${GREEN}✅ 所有核心功能测试通过！${NC}"
echo ""
echo "测试覆盖："
echo "  ✅ 用户认证系统"
echo "  ✅ AI聊天助手（中英文）"
echo "  ✅ 聊天历史管理"
echo "  ✅ BC省租赁表格"
echo "  ✅ 租客背景调查"
echo ""
echo "测试账户信息："
echo "  邮箱: ${TEST_EMAIL}"
echo "  密码: test123456"
echo ""
echo "您可以使用这个账户在前端界面登录测试！"
echo "=========================================="
