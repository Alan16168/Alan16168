#!/bin/bash

echo "🚀 启动 BC 省房东管理系统开发环境"
echo "========================================="

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装"
    echo "请先安装 Node.js (>= 18.0.0)"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查 MongoDB
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  警告: MongoDB 客户端未找到"
    echo "正在尝试启动 Docker MongoDB..."
    
    if command -v docker &> /dev/null; then
        # 检查 MongoDB 容器是否已存在
        if docker ps -a | grep -q mongodb; then
            echo "📦 启动现有 MongoDB 容器..."
            docker start mongodb
        else
            echo "📦 创建新的 MongoDB 容器..."
            docker run -d -p 27017:27017 --name mongodb mongo:latest
        fi
        echo "✅ MongoDB 已启动"
    else
        echo "❌ 错误: Docker 未安装，且无法连接 MongoDB"
        echo "请安装 MongoDB 或 Docker"
        exit 1
    fi
else
    echo "✅ MongoDB 客户端已安装"
fi

# 检查后端依赖
if [ ! -d "backend/node_modules" ]; then
    echo "📦 安装后端依赖..."
    cd backend
    npm install
    cd ..
fi

# 检查前端依赖
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 安装前端依赖..."
    cd frontend
    npm install
    cd ..
fi

# 检查环境变量文件
if [ ! -f "backend/.env" ]; then
    echo "⚠️  警告: backend/.env 文件不存在"
    echo "正在从 .env.example 创建..."
    cp backend/.env.example backend/.env
    echo "⚠️  请编辑 backend/.env 文件，填入你的 OpenAI API 密钥"
fi

echo ""
echo "========================================="
echo "🎉 准备完成！正在启动服务..."
echo "========================================="
echo ""
echo "后端服务将运行在: http://localhost:5000"
echo "前端服务将运行在: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo ""

# 启动后端和前端
trap 'kill 0' SIGINT

cd backend && npm run dev &
BACKEND_PID=$!

cd frontend && npm run dev &
FRONTEND_PID=$!

wait
