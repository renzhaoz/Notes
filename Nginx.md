# Nginx

## 目录结构

- events
- http
  - serve
    - location

## Nginx config

      #-----------全局块 START-----------
      user  nobody;                                     # 运行用户，默认即是nginx，可以不进行设置
      worker_processes  1;                              # Nginx 进程数，一般设置为和 CPU 核数一样
      worker_processes auto;                            # Nginx 进程数 与当前 CPU 物理核心数一致
      error_log  /var/log/nginx/error.log warn;         # Nginx 的错误日志存放目录，日志级别是warn
      pid        /var/run/nginx.pid;                    # Nginx 服务启动时的 pid 存放位置
      worker_rlimit_nofile 20480;                       # 可以理解成每个 worker 子进程的最大连接数量。
      ​
      #-----------全局块 END-----------
      ​
      #-----------events块 START-----------
      events {
          accept_mutex on;   #设置网路连接序列化，防止惊群现象发生，默认为on
          multi_accept on;  #设置一个进程是否同时接受多个网络连接，默认为off
          # 事件驱动模型有 select|poll|kqueue|epoll|resig|/dev/poll|eventport
          use epoll;   #使用 epoll的I/O模型，建议使用默认
          worker_connections 1024;   # 每个进程允许最大并发数
      }
      #-----------events块 END-----------
      ​
      http {   # 配置使用最频繁的部分，代理、缓存、日志定义等绝大多数功能和第三方模块的配置都在这里设置
          # 设置日志自定义格式
          log_format  myFormat  '$remote_addr - $remote_user [$time_local] "$request" '
                            '$status $body_bytes_sent "$http_referer" '
                            '"$http_user_agent" "$http_x_forwarded_for"';
      ​
          access_log  /var/log/nginx/access.log  myFormat;   # Nginx访问日志存放位置，并采用上面定义好的格式
      ​
          sendfile            on;   # 开启高效传输模式
          tcp_nopush          on;   # 减少网络报文段的数量
          tcp_nodelay         on;
          keepalive_timeout   65;   # 保持连接的时间，也叫超时时间，单位秒
          types_hash_max_size 2048;
      ​
          include             /etc/nginx/mime.types;      # 文件扩展名与类型映射表
          default_type        application/octet-stream;   # 默认文件类型
      ​
          include /etc/nginx/conf.d/*.conf;   # 使用include引入其他子配置项，不存在会报错
          
          server {
              keepalive_requests 120; #单连接请求上限次数。
              listen       80;       # 配置监听的端口
              server_name  localhost 127.0.0.1 baimuxym.cn;    # 配置监听的域名或者地址，可多个，用空格隔开
              
              location / {
                  root   /usr/share/nginx/html;  # 网站根目录
                  index  index.html index.htm;   # 默认首页文件
                  deny 172.18.5.54   # 禁止访问的ip地址，可以为all
                  allow 172.18.5.53;# 允许访问的ip地址，可以为all
              }
                # 图片防盗链
              location ~* \.(gif|jpg|jpeg|png|bmp|swf)$ {
                  valid_referers none blocked 192.168.0.2;  # 只允许本机 IP 外链引用
                  if ($invalid_referer){
                    return 403;
                  }
                }
              
              #新增内容，可以在自己的server单独配置错误日志
              error_log    logs/error_localhost.log    error;
              
              error_page 500 502 503 504 /50x.html;  # 默认50x对应的访问页面
              error_page 400 404 error.html;   # 同上
          }
      }