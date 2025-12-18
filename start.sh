#!/bin/bash

# 儿童识字小报生成器启动脚本

echo "正在启动儿童识字小报生成器..."

# 检查文件是否存在
if [ ! -f "index.html" ]; then
    echo "错误：找不到index.html文件"
    exit 1
fi

# 尝试使用不同的浏览器打开
if command -v open &> /dev/null; then
    # macOS
    open index.html
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open index.html
elif command -v start &> /dev/null; then
    # Windows
    start index.html
else
    echo "请用浏览器打开以下文件："
    echo "$(pwd)/index.html"
fi

echo "应用已启动！"