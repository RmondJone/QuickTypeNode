# 一、背景介绍
本Node服务是集成了QuickType，对其二次开发的一个Node服务。主要为[YApiQuickType插件](https://github.com/RmondJone/YapiQuickType) 提供解析服务

修复了QuickType一些使用场景上的问题，如下几点：
* Java类不能生成到一个文件中
* Dart类生成的不对，没有适配空安全写法

# 二、本地搭建
你可以通过以下两种方式搭建此Node服务

**1、直接本地启动服务**
执行以下2条命令即可，启动成功后控制台会打印服务访问链接
```
npm install 
npm start
```

**2、Docker镜像启动**

```
docker run -d -p 8085:8085 guohanlin/quicktype:latest
```
