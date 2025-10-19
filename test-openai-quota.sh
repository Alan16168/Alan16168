#!/bin/bash

# OpenAI API 配额测试脚本
# 用于验证 OpenAI API 配额是否充足，系统是否正常工作

echo "================================================================="
echo "          🧪 OpenAI API 配额验证测试"
echo "================================================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 后端 API 地址
API_URL="http://localhost:5000"

echo "📍 步骤 1: 检查后端服务状态..."
HEALTH_CHECK=$(curl -s "${API_URL}/api/health")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 后端服务运行正常${NC}"
    echo "$HEALTH_CHECK" | jq '.'
else
    echo -e "${RED}❌ 后端服务未响应${NC}"
    exit 1
fi
echo ""

echo "📍 步骤 2: 登录获取认证令牌..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"demo123456"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ 登录失败${NC}"
    echo "$LOGIN_RESPONSE" | jq '.'
    exit 1
fi

echo -e "${GREEN}✅ 登录成功${NC}"
echo "Token: ${TOKEN:0:40}..."
echo ""

echo "📍 步骤 3: 测试真实 GPT-4 API 响应..."
echo -e "${YELLOW}⏳ 发送测试问题到 GPT-4（可能需要 5-15 秒）...${NC}"
echo ""

SESSION_ID="test-session-$(date +%s)"

CHAT_RESPONSE=$(curl -s -X POST "${API_URL}/api/chat/message" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"message\": \"在BC省，租客可以养宠物吗？请简短回答。\", \"sessionId\": \"$SESSION_ID\", \"language\": \"zh\"}")

# 检查是否成功
SUCCESS=$(echo "$CHAT_RESPONSE" | jq -r '.success')
ERROR=$(echo "$CHAT_RESPONSE" | jq -r '.error // empty')

echo "================================================================="
echo "                    📊 测试结果"
echo "================================================================="
echo ""

if [ "$SUCCESS" == "true" ]; then
    echo -e "${GREEN}✅ OpenAI API 配额充足，系统运行正常！${NC}"
    echo ""
    echo "🤖 GPT-4 响应内容："
    echo "─────────────────────────────────────────────────────────────"
    echo "$CHAT_RESPONSE" | jq -r '.response' | fold -w 65
    echo "─────────────────────────────────────────────────────────────"
    echo ""
    echo "📊 响应详情："
    echo "$CHAT_RESPONSE" | jq '{success, conversationId, fromKnowledgeBase, timestamp}'
    echo ""
    echo -e "${GREEN}🎉 恭喜！真实生产环境已就绪！${NC}"
    
elif echo "$ERROR" | grep -q "429"; then
    echo -e "${RED}❌ OpenAI API 配额不足${NC}"
    echo ""
    echo "错误信息："
    echo "$ERROR"
    echo ""
    echo "请按照以下步骤充值："
    echo "1. 访问: https://platform.openai.com/account/billing/overview"
    echo "2. 添加支付方式并充值"
    echo "3. 建议充值金额: \$10-50 USD"
    echo "4. 充值完成后重新运行此脚本"
    
elif echo "$ERROR" | grep -q "401"; then
    echo -e "${RED}❌ OpenAI API Key 无效或已过期${NC}"
    echo ""
    echo "请检查 .env 文件中的 OPENAI_API_KEY"
    
else
    echo -e "${RED}❌ 请求失败${NC}"
    echo ""
    echo "完整响应："
    echo "$CHAT_RESPONSE" | jq '.'
fi

echo ""
echo "================================================================="
