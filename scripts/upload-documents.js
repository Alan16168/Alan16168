const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// 配置
const API_BASE_URL = process.env.API_URL || 'http://localhost:5000';
const ADMIN_TOKEN = process.argv[2]; // 从命令行获取管理员Token

// 文档映射
const documents = [
  {
    filename: 'BC RTA.docx',
    category: 'RTA',
    description: 'BC省住宅租赁法'
  },
  {
    filename: 'BC RESIDENTIAL TENANCY REGULATION.docx',
    category: 'Regulation',
    description: 'BC省住宅租赁条例'
  },
  {
    filename: 'rtb1_chrome.docx',
    category: 'Tenancy_Agreement',
    description: '住宅租赁协议表格'
  },
  {
    filename: 'Converting to Excel To Word_房屋维护表.docx',
    category: 'Maintenance',
    description: '房屋维护表'
  },
  {
    filename: '加拿大BC省出租管理电话.docx',
    category: 'Contact',
    description: 'BC省出租管理联系方式'
  },
  {
    filename: '加拿大BC省房屋维护指南.docx',
    category: 'Maintenance',
    description: 'BC省房屋维护指南'
  },
  {
    filename: 'BC省民用住宅出租管理完全手册.docx',
    category: 'Manual',
    description: 'BC省出租管理完全手册'
  }
];

async function uploadDocument(filePath, category, token) {
  try {
    const form = new FormData();
    form.append('document', fs.createReadStream(filePath));
    form.append('category', category);

    const response = await axios.post(
      `${API_BASE_URL}/api/documents/upload`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

async function main() {
  console.log('📤 BC省房东管理系统 - 文档上传工具');
  console.log('========================================');
  console.log('');

  // 检查Token
  if (!ADMIN_TOKEN) {
    console.error('❌ 错误: 未提供管理员Token');
    console.log('');
    console.log('用法:');
    console.log('  node upload-documents.js <ADMIN_TOKEN> [DOCUMENTS_DIR]');
    console.log('');
    console.log('如何获取Token:');
    console.log('  1. 使用管理员账户登录系统');
    console.log('  2. 打开浏览器开发者工具 (F12)');
    console.log('  3. 在 Network 标签中找到任意 API 请求');
    console.log('  4. 在 Request Headers 中找到 Authorization: Bearer <token>');
    console.log('  5. 复制 <token> 部分');
    console.log('');
    process.exit(1);
  }

  // 文档目录
  const docsDir = process.argv[3] || './documents';
  
  console.log(`📁 文档目录: ${docsDir}`);
  console.log(`🔗 API地址: ${API_BASE_URL}`);
  console.log('');

  // 检查目录是否存在
  if (!fs.existsSync(docsDir)) {
    console.error(`❌ 错误: 文档目录不存在: ${docsDir}`);
    console.log('');
    console.log('请将以下文档放入指定目录:');
    documents.forEach(doc => {
      console.log(`  - ${doc.filename}`);
    });
    console.log('');
    process.exit(1);
  }

  let successCount = 0;
  let failCount = 0;

  // 上传每个文档
  for (const doc of documents) {
    const filePath = path.join(docsDir, doc.filename);
    
    console.log(`📄 处理: ${doc.filename}`);
    console.log(`   分类: ${doc.category}`);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.log(`   ⚠️  跳过: 文件不存在`);
      console.log('');
      failCount++;
      continue;
    }

    try {
      const result = await uploadDocument(filePath, doc.category, ADMIN_TOKEN);
      console.log(`   ✅ 上传成功`);
      console.log(`   📊 文档块数: ${result.document.chunkCount}`);
      console.log('');
      successCount++;
    } catch (error) {
      console.log(`   ❌ 上传失败: ${error.message}`);
      console.log('');
      failCount++;
    }
  }

  // 显示总结
  console.log('========================================');
  console.log('📊 上传总结');
  console.log('========================================');
  console.log(`✅ 成功: ${successCount}`);
  console.log(`❌ 失败: ${failCount}`);
  console.log(`📝 总计: ${documents.length}`);
  console.log('');

  if (successCount > 0) {
    console.log('🎉 文档上传完成！系统现在可以使用AI助手功能了。');
  } else {
    console.log('⚠️  没有文档上传成功，请检查错误信息。');
  }
}

main().catch(error => {
  console.error('❌ 致命错误:', error.message);
  process.exit(1);
});
