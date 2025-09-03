#!/bin/bash
docker build -t quicktype .
docker tag quicktype guohanlin/quicktype:1.4.0
docker login
docker push guohanlin/quicktype:1.4.0