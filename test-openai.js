const axios = require('axios');

async function testOpenAIIntegration() {
  try {
    console.log('🧪 测试 OpenAI API 集成...\n');
    
    // 测试1: 健康检查
    console.log('1️⃣ 测试健康检查端点...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ 健康检查成功');
    console.log('   模式:', healthResponse.data.mode);
    console.log('   AI聊天:', healthResponse.data.features.ai_chat);
    console.log('   RAG:', healthResponse.data.features.rag);
    console.log('');
    
    // 测试2: 登录获取token
    console.log('2️⃣ 测试用户登录...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@demo.com',
      password: 'demo123456'
    });
    const token = loginResponse.data.token;
    console.log('✅ 登录成功');
    console.log('   用户:', loginResponse.data.user.name);
    console.log('   角色:', loginResponse.data.user.role);
    console.log('');
    
    // 测试3: AI聊天（真实GPT-4响应）
    console.log('3️⃣ 测试AI聊天（真实GPT-4）...');
    console.log('   问题: BC省租客可以养宠物吗？');
    const chatResponse = await axios.post(
      'http://localhost:5000/api/chat/message',
      {
        message: 'BC省租客可以养宠物吗？',
        language: 'zh',
        sessionId: 'test-session-' + Date.now()
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('✅ AI响应成功');
    console.log('   回答:', chatResponse.data.message.substring(0, 200) + '...');
    console.log('   来源文档数量:', chatResponse.data.sources?.length || 0);
    console.log('   是否来自知识库:', chatResponse.data.isFromKnowledgeBase);
    console.log('');
    
    console.log('🎉 所有测试通过！OpenAI API 集成正常工作！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    if (error.response) {
      console.error('   状态码:', error.response.status);
      console.error('   错误详情:', error.response.data);
    }
  }
}

testOpenAIIntegration();
