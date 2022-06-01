# 1. Background introduction

This Node service is a Node service that integrates QuickType for secondary development.Mainly provides parsing services
for the [YApiQuickType plugin](https://github.com/RmondJone/YapiQuickType)

Fixed some usage scenarios of QuickType, as follows:

* Java classes cannot be generated into a file
* The Dart class is generated incorrectly, and it does not adapt to the null-safe writing method.

# 2. Local construction

You can build this Node service in the following two ways

**1. Directly start the service locally**

Execute the following 2 commands. After the startup is successful, the console will print the service access link

```
npm install 
npm start
```

**2. Docker image startup**

```
docker run --name=quicktype -d -p 8085:8085 guohanlin/quicktype:latest
```

[中文文档](./README_CN.md)
