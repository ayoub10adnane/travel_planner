# 使用 Node.js 16 官方镜像作为基础镜像
FROM node:16

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用代码
COPY . .

# 暴露应用运行的端口
EXPOSE 5100

# 启动应用
CMD ["node", "server.js"]