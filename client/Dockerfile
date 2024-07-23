# 使用 Node.js 官方镜像作为基础镜像
FROM node:14

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用代码
COPY . .

# 构建前端应用
RUN npm run build

# 使用 serve 包来提供静态文件
RUN npm install -g serve

# 暴露应用运行的端口
EXPOSE 3000

# 启动应用
CMD ["serve", "-s", "build"]