#!/bin/bash
# GitHub 自动推送脚本
# 使用方法: ./push.sh "提交信息"

cd /workspace/projects/manufacturing-dashboard

# Token 配置（请替换为你的 GitHub Personal Access Token）
GITHUB_TOKEN="YOUR_GITHUB_TOKEN_HERE"

# 设置远程仓库（仅首次需要）
git remote set-url origin https://github.com/zjh1202/erp-dashboard-vue.git

# 获取提交信息
if [ -z "$1" ]; then
    COMMIT_MSG="update: $(date '+%Y-%m-%d %H:%M:%S')"
else
    COMMIT_MSG="$1"
fi

# 添加所有更改
git add -A

# 检查是否有更改
if git diff --staged --quiet; then
    echo "没有检测到更改"
    exit 0
fi

# 提交
git commit -m "$COMMIT_MSG"

# 推送到 GitHub（使用 Token 认证）
git push -u https://${GITHUB_TOKEN}@github.com/zjh1202/erp-dashboard-vue.git main

echo "✅ 推送完成！"
