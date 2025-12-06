# 部署和维护指南

## 环境要求

### 系统环境
- Node.js >= 18.0.0 (推荐使用最新LTS版本)
- pnpm >= 8.0.0
- Git >= 2.30.0

### 验证环境
```bash
# 检查Node.js版本
node --version

# 检查pnpm版本
pnpm --version

# 检查Git版本
git --version
```

## 开发环境部署

### 1. 克隆项目
```bash
git clone <repository-url>
cd 2025-Cursor-hackthon
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 启动开发服务器
```bash
pnpm dev
```
开发服务器将在 `http://localhost:3000` 启动

### 4. 代码质量检查
```bash
# 运行ESLint检查
pnpm lint

# 构建生产版本验证
pnpm build
```

## 生产环境部署

### 1. 构建生产版本
```bash
pnpm build
```

### 2. 预览构建结果
```bash
pnpm preview
```

### 3. 部署到Web服务器
将 `dist` 目录下的文件部署到Web服务器（如Nginx、Apache等）

#### Nginx配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 维护脚本

### 开发维护脚本
```bash
#!/bin/bash
# dev-maintenance.sh

echo "=== 开发环境维护 ==="

# 更新依赖
echo "更新依赖包..."
pnpm update

# 运行代码检查
echo "运行代码质量检查..."
pnpm lint

# 构建验证
echo "构建验证..."
pnpm build

echo "维护完成"
```

### 生产部署脚本
```bash
#!/bin/bash
# deploy-production.sh

echo "=== 生产环境部署 ==="

# 拉取最新代码
echo "拉取最新代码..."
git pull origin main

# 安装依赖
echo "安装依赖..."
pnpm install --frozen-lockfile

# 构建生产版本
echo "构建生产版本..."
pnpm build

# 重启服务 (根据实际部署方式调整)
echo "重启Web服务..."
# systemctl restart nginx
# 或 docker-compose restart web

echo "部署完成"
```

## 监控和日志

### 性能监控
- 使用浏览器开发者工具监控性能
- 定期检查构建输出大小
- 监控首次加载时间

### 错误监控
- 配置前端错误收集服务（如Sentry）
- 监控构建失败和运行时错误

## 备份策略

### 代码备份
- 使用Git进行版本控制
- 定期推送到远程仓库
- 重要版本打Tag

### 配置备份
```bash
# 备份package.json和配置文件
cp package.json package.json.backup
cp vite.config.ts vite.config.ts.backup
cp tsconfig.json tsconfig.json.backup
```

## 故障排除

### 常见问题

#### 依赖安装失败
```bash
# 清理缓存重试
pnpm store prune
pnpm install
```

#### 构建失败
```bash
# 检查TypeScript错误
npx tsc --noEmit

# 检查ESLint错误
pnpm lint

# 清理构建缓存
rm -rf dist node_modules/.vite
pnpm build
```

#### 开发服务器无法启动
```bash
# 检查端口占用
lsof -i :3000

# 更换端口
pnpm dev --port 3001
```

## 更新日志
- v0.1.1: 完善项目配置和部署文档
- v0.1.0: 初始化项目结构
