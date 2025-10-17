const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../backend/.env' });

// 简单的用户模型定义
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  isActive: Boolean,
  createdAt: Date
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // 连接数据库
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bc-landlord-manager';
    console.log('🔌 连接到 MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB 连接成功');

    // 管理员信息
    const adminEmail = process.argv[2] || 'admin@example.com';
    const adminPassword = process.argv[3] || 'admin123456';
    const adminName = process.argv[4] || 'System Admin';

    // 检查管理员是否已存在
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('⚠️  管理员账户已存在');
      console.log(`📧 邮箱: ${existingAdmin.email}`);
      console.log(`👤 角色: ${existingAdmin.role}`);
      
      // 提示是否更新为管理员
      if (existingAdmin.role !== 'admin') {
        console.log('🔄 正在更新为管理员角色...');
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ 角色已更新为管理员');
      }
    } else {
      // 创建新管理员
      console.log('🔐 加密密码...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      console.log('👤 创建管理员账户...');
      const admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        language: 'en',
        createdAt: new Date()
      });

      console.log('');
      console.log('✅ 管理员账户创建成功！');
      console.log('========================================');
      console.log(`📧 邮箱: ${admin.email}`);
      console.log(`🔑 密码: ${adminPassword}`);
      console.log(`👤 姓名: ${admin.name}`);
      console.log(`🎯 角色: ${admin.role}`);
      console.log('========================================');
      console.log('');
      console.log('⚠️  请妥善保管管理员密码！');
      console.log('💡 建议首次登录后立即修改密码');
    }

    // 关闭数据库连接
    await mongoose.connection.close();
    console.log('');
    console.log('👋 数据库连接已关闭');
    process.exit(0);

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

// 显示使用说明
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🔧 创建管理员账户脚本

用法:
  node create-admin.js [email] [password] [name]

参数:
  email    - 管理员邮箱 (默认: admin@example.com)
  password - 管理员密码 (默认: admin123456)
  name     - 管理员姓名 (默认: System Admin)

示例:
  node create-admin.js
  node create-admin.js admin@mydomain.com mypassword "My Name"

注意:
  - 确保 MongoDB 正在运行
  - 确保已配置 backend/.env 文件
  `);
  process.exit(0);
}

// 运行脚本
createAdmin();
