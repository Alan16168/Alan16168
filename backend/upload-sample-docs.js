const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const OpenAI = require('openai');
const Document = require('./models/Document.model');

// Load environment variables
require('dotenv').config();

// 连接配置
const MONGODB_URI = 'mongodb://127.0.0.1:39861/';

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY not found in environment variables');
  console.error('   Please set OPENAI_API_KEY in backend/.env file');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 将文本分块
function chunkText(text, chunkSize = 500) {
  const chunks = [];
  const paragraphs = text.split('\n\n');
  let currentChunk = '';
  
  for (const para of paragraphs) {
    if ((currentChunk + para).length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

// 获取 embedding
async function getEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error getting embedding:', error.message);
    throw error;
  }
}

// 处理文档
async function processDocument(filePath, category = 'RTA', userId) {
  const fileName = path.basename(filePath);
  console.log(`\n📄 处理文档: ${fileName}`);
  
  // 读取文件
  const content = fs.readFileSync(filePath, 'utf-8');
  console.log(`   文件大小: ${content.length} 字符`);
  
  // 分块
  const textChunks = chunkText(content, 500);
  console.log(`   分成 ${textChunks.length} 个块`);
  
  // 为每个块生成 embedding
  const chunks = [];
  for (let i = 0; i < textChunks.length; i++) {
    console.log(`   生成 embedding ${i + 1}/${textChunks.length}...`);
    const embedding = await getEmbedding(textChunks[i]);
    chunks.push({
      text: textChunks[i],
      embedding: embedding,
      chunkIndex: i
    });
  }
  
  // 保存到数据库
  const doc = await Document.create({
    originalName: fileName,
    filename: fileName,
    mimeType: 'text/plain',
    size: content.length,
    category: category,
    content: content,
    chunks: chunks,
    isActive: true,
    uploadedBy: userId,
    metadata: {
      language: 'zh',
      tags: ['BC租赁法', '法律文档']
    }
  });
  
  console.log(`   ✅ 文档已保存到数据库 (ID: ${doc._id})`);
  return doc;
}

// 主函数
async function main() {
  try {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                                                              ║');
    console.log('║        📚 上传 BC 租赁法律文档 - RAG 系统初始化             ║');
    console.log('║                                                              ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    
    // 连接数据库
    console.log('🔌 连接 MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 连接成功');
    
    // 检查 OpenAI API
    console.log('\n🧪 测试 OpenAI Embedding API...');
    const testEmbedding = await getEmbedding('测试');
    console.log(`✅ Embedding API 正常 (向量维度: ${testEmbedding.length})`);
    
    // 获取文档目录
    const docsDir = path.join(__dirname, '..', 'sample-docs');
    if (!fs.existsSync(docsDir)) {
      console.error(`❌ 文档目录不存在: ${docsDir}`);
      process.exit(1);
    }
    
    // 获取或创建系统用户
    const User = require('./models/User.model');
    let systemUser = await User.findOne({ email: 'admin@demo.com' });
    if (!systemUser) {
      console.log('⚠️  未找到管理员账户，创建临时账户...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('demo123456', 10);
      systemUser = await User.create({
        name: 'System Admin',
        email: 'admin@demo.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        language: 'zh'
      });
    }
    console.log(`✅ 使用管理员账户: ${systemUser.email}`);
    
    // 获取所有 .txt 文件
    const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.txt'));
    console.log(`\n📂 找到 ${files.length} 个文档文件`);
    
    // 处理每个文件
    const processedDocs = [];
    for (const file of files) {
      const filePath = path.join(docsDir, file);
      const doc = await processDocument(filePath, 'RTA', systemUser._id);
      processedDocs.push(doc);
    }
    
    // 总结
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ 上传完成！                             ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('📊 处理统计:');
    console.log(`   文档总数: ${processedDocs.length}`);
    console.log(`   文本块总数: ${processedDocs.reduce((sum, doc) => sum + doc.chunks.length, 0)}`);
    console.log(`   向量总数: ${processedDocs.reduce((sum, doc) => sum + doc.chunks.length, 0)}`);
    console.log('');
    console.log('📄 已上传的文档:');
    processedDocs.forEach(doc => {
      console.log(`   ✅ ${doc.originalName} (${doc.chunks.length} 个块)`);
    });
    console.log('');
    console.log('🚀 RAG 系统已就绪！现在可以进行基于文档的智能问答了。');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 错误:', error);
    process.exit(1);
  }
}

// 运行
main();
