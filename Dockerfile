#下载Node环境
FROM node:10.12.0-alpine
#作者信息
MAINTAINER guohanlin
#配置linux服务器需要的环境
RUN apk add --no-cache git bash openssh-client tzdata
#配置环境
ENV TZ Asia/Shanghai
#指定到工作目录
WORKDIR /usr/src/app/
#开始执行命令
COPY package.json ./
#Docker镜像环境执行npm
RUN npm install
#拷贝代码到Docker镜像工作目录
COPY . .
#服务透出端口
EXPOSE 8085
#开始运行服务
CMD node ./src/start.js

