#!/bin/bash

echo "════════════════════════════════════════════════════════"
echo "  🧪 测试 RAG 完整功能"
echo "════════════════════════════════════════════════════════"
echo ""

# Step 1: Login to get token
echo "📝 Step 1: 获取认证 Token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"demo123456"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ 登录失败！"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ 登录成功！Token: ${TOKEN:0:20}..."
echo ""

# Step 2: Test RAG with deposit question (covered in uploaded docs)
echo "📝 Step 2: 测试 RAG - 押金问题 (应该匹配到 BC住宅租赁法-押金规定.txt)..."
DEPOSIT_RESPONSE=$(curl -s -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "在BC省，房东可以收多少押金？",
    "sessionId": "rag-test-deposit",
    "language": "zh"
  }')

echo "Response:"
echo "$DEPOSIT_RESPONSE" | jq '.'
echo ""

# Check if sources were found
SOURCES_COUNT=$(echo "$DEPOSIT_RESPONSE" | jq '.sources | length')
IS_FROM_KB=$(echo "$DEPOSIT_RESPONSE" | jq -r '.isFromKnowledgeBase')

echo "═══════════════════════════════════════════════════════"
if [ "$SOURCES_COUNT" != "null" ] && [ "$SOURCES_COUNT" -gt 0 ]; then
  echo "✅ RAG 成功！找到 $SOURCES_COUNT 个相关文档"
  echo "✅ isFromKnowledgeBase: $IS_FROM_KB"
  echo ""
  echo "📚 文档来源:"
  echo "$DEPOSIT_RESPONSE" | jq -r '.sources[] | "   - \(.documentName) (相似度: \(.similarity))"'
else
  echo "⚠️  未找到相关文档 (sources 为空)"
  echo "   isFromKnowledgeBase: $IS_FROM_KB"
fi
echo "═══════════════════════════════════════════════════════"
echo ""

# Step 3: Test with pet policy question
echo "📝 Step 3: 测试 RAG - 宠物政策 (应该匹配到 BC住宅租赁法-宠物政策.txt)..."
PET_RESPONSE=$(curl -s -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "BC省的租客可以养宠物吗？房东能禁止吗？",
    "sessionId": "rag-test-pet",
    "language": "zh"
  }')

SOURCES_COUNT_2=$(echo "$PET_RESPONSE" | jq '.sources | length')
IS_FROM_KB_2=$(echo "$PET_RESPONSE" | jq -r '.isFromKnowledgeBase')

echo "Response:"
echo "$PET_RESPONSE" | jq '.'
echo ""

echo "═══════════════════════════════════════════════════════"
if [ "$SOURCES_COUNT_2" != "null" ] && [ "$SOURCES_COUNT_2" -gt 0 ]; then
  echo "✅ RAG 成功！找到 $SOURCES_COUNT_2 个相关文档"
  echo "✅ isFromKnowledgeBase: $IS_FROM_KB_2"
  echo ""
  echo "📚 文档来源:"
  echo "$PET_RESPONSE" | jq -r '.sources[] | "   - \(.documentName) (相似度: \(.similarity))"'
else
  echo "⚠️  未找到相关文档 (sources 为空)"
  echo "   isFromKnowledgeBase: $IS_FROM_KB_2"
fi
echo "═══════════════════════════════════════════════════════"
echo ""

# Step 4: Test with rent increase question
echo "📝 Step 4: 测试 RAG - 租金上涨 (应该匹配到 BC住宅租赁法-租金上涨.txt)..."
RENT_RESPONSE=$(curl -s -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "房东想涨租金，需要提前多久通知我？",
    "sessionId": "rag-test-rent",
    "language": "zh"
  }')

SOURCES_COUNT_3=$(echo "$RENT_RESPONSE" | jq '.sources | length')
IS_FROM_KB_3=$(echo "$RENT_RESPONSE" | jq -r '.isFromKnowledgeBase')

echo "Response:"
echo "$RENT_RESPONSE" | jq '.'
echo ""

echo "═══════════════════════════════════════════════════════"
if [ "$SOURCES_COUNT_3" != "null" ] && [ "$SOURCES_COUNT_3" -gt 0 ]; then
  echo "✅ RAG 成功！找到 $SOURCES_COUNT_3 个相关文档"
  echo "✅ isFromKnowledgeBase: $IS_FROM_KB_3"
  echo ""
  echo "📚 文档来源:"
  echo "$RENT_RESPONSE" | jq -r '.sources[] | "   - \(.documentName) (相似度: \(.similarity))"'
else
  echo "⚠️  未找到相关文档 (sources 为空)"
  echo "   isFromKnowledgeBase: $IS_FROM_KB_3"
fi
echo "═══════════════════════════════════════════════════════"
echo ""

# Final Summary
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║            RAG 功能测试总结                          ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "测试 1 (押金): Sources: $SOURCES_COUNT, FromKB: $IS_FROM_KB"
echo "测试 2 (宠物): Sources: $SOURCES_COUNT_2, FromKB: $IS_FROM_KB_2"
echo "测试 3 (租金): Sources: $SOURCES_COUNT_3, FromKB: $IS_FROM_KB_3"
echo ""

TOTAL_SUCCESS=0
[ "$SOURCES_COUNT" != "null" ] && [ "$SOURCES_COUNT" -gt 0 ] && TOTAL_SUCCESS=$((TOTAL_SUCCESS + 1))
[ "$SOURCES_COUNT_2" != "null" ] && [ "$SOURCES_COUNT_2" -gt 0 ] && TOTAL_SUCCESS=$((TOTAL_SUCCESS + 1))
[ "$SOURCES_COUNT_3" != "null" ] && [ "$SOURCES_COUNT_3" -gt 0 ] && TOTAL_SUCCESS=$((TOTAL_SUCCESS + 1))

if [ $TOTAL_SUCCESS -eq 3 ]; then
  echo "🎉 所有测试通过！RAG 系统完全正常工作！"
elif [ $TOTAL_SUCCESS -gt 0 ]; then
  echo "⚠️  部分测试通过 ($TOTAL_SUCCESS/3)"
else
  echo "❌ 所有测试失败，需要检查 RAG 配置"
fi
echo ""
