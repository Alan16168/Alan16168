const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const TEST_PAGE = path.join(__dirname, 'test-page.html');

const server = http.createServer((req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/' || req.url === '/test-page.html') {
    fs.readFile(TEST_PAGE, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Error loading test page');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('🌐 测试页面服务器启动成功！');
  console.log('========================================');
  console.log(`📍 本地访问: http://localhost:${PORT}`);
  console.log(`📍 网络访问: http://0.0.0.0:${PORT}`);
  console.log('');
  console.log('💡 使用说明:');
  console.log('   1. 在浏览器打开上述地址');
  console.log('   2. 按照页面指引进行测试');
  console.log('   3. 所有功能都可以在网页中测试');
  console.log('');
  console.log('按 Ctrl+C 停止服务器');
  console.log('========================================');
});
