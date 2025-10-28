#!/bin/bash
# 运行HTML Demo服务器

echo "🚀 Starting Tech Jobs Hub Demo..."
echo ""
echo "📁 Serving from: $(pwd)"
echo "🌐 URL: http://localhost:8000"
echo ""
echo "✅ Open your browser and visit:"
echo "   http://localhost:8000"
echo ""
echo "💰 Demo Features:"
echo "   - 首页：职位搜索"
echo "   - 职位详情：3个联盟按钮（点击查看盈利演示）"
echo "   - 公司页面：Glassdoor集成"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 启动Python简单HTTP服务器
python3 -m http.server 8000

