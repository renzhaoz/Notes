# Docker

## 安装

[详见官网](https://docs.docker.com/engine/install/);

## 概念

### 容器docker

每个容器(docker程序)中都需要运行一个镜像(linux系统)。如果没有相关镜像则会自动下载。容器可以被创建启动停止删除暂停.

### 镜像image

容器中的镜像都是从docker相关社区或者公共镜像下载的,是linux的计算机镜像。

### 仓库Repository

仓库保存镜像。

## 常用使用场景

- 容器启动镜像 基于镜像运行命令 运行结束即退出容器

      // 用容器启动ubuntu15镜像 没有则下载 然后使用ubuntu15输出 'Hello World!'
      docker run ubuntu:15.10 /bin/echo "Hello world"

- 容器启动相关镜像并进入终端 用户可运行交互式命令 需要主动退出终端 退出终端即结束容器

      // 启动容器并进入镜像终端 可运行交互式命令 需要用户自己退出
      docker run -i -t ubuntu:15.10 /bin/bash

- 后台模式

      // 容器启动一个以进程运行的后台程序 返回一个容器ID 用于管理后台容器
      docker run -d ubuntu:15.10 /bin/sh -c "while true; do echo hello world; sleep 1; done"
      >: 2b1b7a428627c51ab8810d541d759f072b4fc75487eed05812646b8534a2fe63

## 常用命令

### docker命令

- docker ps 查看所有运行中的docker实例 -a则展示所有状态的容器

- docker start [dockerID] 启动已经停止的容器

- docker restart [dockerID] 重启容器

- docker run -it -d -p --name=dockerName  imageName /bin/bash(要运行的命令) 后台运行docker
-it与容器交互式启动是-i,-t的简写
-d后台启动模式
--name 设置启动容器的name
imageName 选择要启动的imageName
/bin/bash 交互路径
-p host/5000:5000/type 地址/宿主端口:docker端口/通信协议(tcp/udp) 设置端口的映射
-P 自动映射端口信息 使用```docker port dockerID```查看具体映射信息

- docker exec/attach -it [dockerName] /bin/bash 进入运行中容器镜像的终端
一般推荐使用exec 退出终端容器依旧运行  attach退出终端容器也会stop

- docker stop [dockerName] 停止docker

- docker logs [dockerID] 查看docker日志

- docker export [dockerID] > ubuntu.tar 导出某个容器

- cat docker/ubuntu.tar | docker import - test/ubuntu:v1 导入容器
- docker import http://example.com/exampleimage.tgz example/imagerepo 从网络导入容器

- docker rm -f [dockerID] 删除容器

> ```sudo service docker start/sudo systemctl start docker```每次运行docker需要先启动docker服务

### 镜像命令

- docker image ls 列出所有本地镜像
- docker search imagesName 搜索images从docker.hub
- docker pull ubuntu:tag 载入指定tag的镜像 不指定tag则下载最新镜像
- docker image rm [imagename] 删除某image

> 当docker.hub中的镜像不符合需求时有两种方式自定义镜像
> 1.从已经创建的容器中更新镜像 并且提交这个镜像到docker.hub
> 2.使用Dockerfile指令来创建一个新的镜像

- docker commit -m="has update" -a="runoob" imagesID REPOSITORYName 创建镜像副本

-m备注 -a指定创建该镜像的作者 imagesID镜像ID REPOSITORYName 仓库名称

- docker build -t runoob/centos:6.7 dockerfilePath 从零开始构建一个docker镜像(Dockerfile)

-t要创建的镜像名称 dockerfilePath路径是Dockerfile的文件目录

- docker tag imagesId imagesName 设置images的tag

## 拓展

### DOCKERFILE 文件格式

FROM- 镜像从那里来
MAINTAINER- 镜像维护者信息
RUN- 构建镜像执行的命令，每一次RUN都会构建一层
CMD- 容器启动的命令，如果有多个则以最后一个为准，也可以为ENTRYPOINT提供参数
VOLUME- 定义数据卷，如果没有定义则使用默认
USER- 指定后续执行的用户组和用户
WORKDIR- 切换当前执行的工作目录
HEALTHCHECH- 健康检测指令
ARG- 变量属性值，但不在容器内部起作用
EXPOSE- 暴露端口
ENV- 变量属性值，容器内部也会起作用
ADD- 添加文件，如果是压缩文件也解压
COPY- 添加文件，以复制的形式
ENTRYPOINT- 容器进入时执行的命令

### 容器互联

当多个容器需要建立网络通信时需要将多个容器连接起来.使用-p参数建立端口映射不是唯一的方法.docker本身可以建立一个公有的父级容器.该容器中可以看到所有的子容器.

1. docker network create -d bridge test-net 创建一个bridge类型的name为test-net的docker网络
-d：参数指定 Docker 网络类型，有 bridge、overlay。 overlay 网络类型用于 Swarm mode
2. docker run -itd --name test1 --network test-net ubuntu /bin/bash 运行一个容器并连接到test-net网络
3. docker run -itd --name test2 --network test-net ubuntu /bin/bash 创建另外一个容器连接到test-net网络
4. docker exec -it test1 /bin/bash 连接test1
5. ping test2 在test1的终端中ping test2 连接已建通

> 配置DNS
>我们可以在宿主机的 /etc/docker/daemon.json 文件中增加以下内容来设置全部容器的 DNS
> ```{"dns" : ["114.114.114.114","8.8.8.8"]}```
> docker run -it --rm  ubuntu  cat etc/resolv.conf 重启docker生效
