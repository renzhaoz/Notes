# Net

Node.js Net 模块提供了一些用于底层的网络通信的小工具，包含了创建服务器/客户端的方法，我们可以通过以下方式引入该模块： 
var net = require("net")

## 方法

1 net.createServer([options][, connectionListener])
创建一个 TCP 服务器。参数 connectionListener 自动给 'connection' 事件创建监听器。 
2 net.connect(options[, connectionListener])
返回一个新的 'net.Socket'，并连接到指定的地址和端口。
 当 socket 建立的时候，将会触发 'connect' 事件。 
3 net.createConnection(options[, connectionListener])
创建一个到端口 port 和 主机 host的 TCP 连接。 host 默认为 'localhost'。 
4 net.connect(port[, host][, connectListener])
创建一个端口为 port 和主机为 host的 TCP 连接 。host 默认为 'localhost'。参数 connectListener 将会作为监听器添加到 'connect' 事件。返回 'net.Socket'。 
5 net.createConnection(port[, host][, connectListener])
创建一个端口为 port 和主机为 host的 TCP 连接 。host 默认为 'localhost'。参数 connectListener 将会作为监听器添加到 'connect' 事件。返回 'net.Socket'。 
6 net.connect(path[, connectListener])
创建连接到 path 的 unix socket 。参数 connectListener 将会作为监听器添加到 'connect' 事件上。返回 'net.Socket'。 
7 net.createConnection(path[, connectListener])
创建连接到 path 的 unix socket 。参数 connectListener 将会作为监听器添加到 'connect' 事件。返回 'net.Socket'。 
8 net.isIP(input)
检测输入的是否为 IP 地址。 IPV4 返回 4， IPV6 返回 6，其他情况返回 0。 
9 net.isIPv4(input)
如果输入的地址为 IPV4， 返回 true，否则返回 false。 
10 net.isIPv6(input)
如果输入的地址为 IPV6， 返回 true，否则返回 false。 


## net.server

1 server.listen(port[, host][, backlog][, callback])
监听指定端口 port 和 主机 host ac连接。 默认情况下 host 接受任何 IPv4 地址(INADDR_ANY)的直接连接。端口 port 为 0 时，则会分配一个随机端口。 
2 server.listen(path[, callback])
通过指定 path 的连接，启动一个本地 socket 服务器。 
3 server.listen(handle[, callback])
通过指定句柄连接。 
4 server.listen(options[, callback])
options 的属性：端口 port, 主机 host, 和 backlog, 以及可选参数 callback 函数, 他们在一起调用server.listen(port, [host], [backlog], [callback])。还有，参数 path 可以用来指定 UNIX socket。 
5 server.close([callback])
服务器停止接收新的连接，保持现有连接。这是异步函数，当所有连接结束的时候服务器会关闭，并会触发 'close' 事件。 
6 server.address()
操作系统返回绑定的地址，协议族名和服务器端口。 
7 server.unref()
如果这是事件系统中唯一一个活动的服务器，调用 unref 将允许程序退出。 
8 server.ref()
与 unref 相反，如果这是唯一的服务器，在之前被 unref 了的服务器上调用 ref 将不会让程序退出（默认行为）。如果服务器已经被 ref，则再次调用 ref 并不会产生影响。 
9 server.getConnections(callback)
异步获取服务器当前活跃连接的数量。当 socket 发送给子进程后才有效；回调函数有 2 个参数 err 和 count。 


## net.Socket

net.Socket 对象是 TCP 或 UNIX Socket 的抽象。net.Socket 实例实现了一个双工流接口。 他们可以在用户创建客户端(使用 connect())时使用, 或者由 Node 创建它们，并通过 connection 服务器事件传递给用户。

- 事件
1 lookup
在解析域名后，但在连接前，触发这个事件。对 UNIX sokcet 不适用。 
2 connect
成功建立 socket 连接时触发。 
3 data
当接收到数据时触发。 
4 end
当 socket 另一端发送 FIN 包时，触发该事件。 
5 timeout
当 socket 空闲超时时触发，仅是表明 socket 已经空闲。用户必须手动关闭连接。 
6 drain
当写缓存为空得时候触发。可用来控制上传。 
7 error
错误发生时触发。 
8 close
当 socket 完全关闭时触发。参数 had_error 是布尔值，它表示是否因为传输错误导致 socket 关闭。 

- 属性
1 socket.bufferSize
该属性显示了要写入缓冲区的字节数。 
2 socket.remoteAddress
远程的 IP 地址字符串，例如：'74.125.127.100' or '2001:4860:a005::68'。 
3 socket.remoteFamily
远程IP协议族字符串，比如 'IPv4' or 'IPv6'。 
4 socket.remotePort
远程端口，数字表示，例如：80 or 21。 
5 socket.localAddress
网络连接绑定的本地接口 远程客户端正在连接的本地 IP 地址，字符串表示。例如，如果你在监听'0.0.0.0'而客户端连接在'192.168.1.1'，这个值就会是 '192.168.1.1'。 
6 socket.localPort
本地端口地址，数字表示。例如：80 or 21。 
7 socket.bytesRead
接收到得字节数。 
8 socket.bytesWritten
发送的字节数。 

- 方法
1 new net.Socket([options])
构造一个新的 socket 对象。 
2 socket.connect(port[, host][, connectListener])
指定端口 port 和 主机 host，创建 socket 连接 。参数 host 默认为 localhost。通常情况不需要使用 net.createConnection 打开 socket。只有你实现了自己的 socket 时才会用到。 
3 socket.connect(path[, connectListener])
打开指定路径的 unix socket。通常情况不需要使用 net.createConnection 打开 socket。只有你实现了自己的 socket 时才会用到。 
4 socket.setEncoding([encoding])
设置编码 
5 socket.write(data[, encoding][, callback])
在 socket 上发送数据。第二个参数指定了字符串的编码，默认是 UTF8 编码。 
6 socket.end([data][, encoding])
半关闭 socket。例如，它发送一个 FIN 包。可能服务器仍在发送数据。 
7 socket.destroy()
确保没有 I/O 活动在这个套接字上。只有在错误发生情况下才需要。（处理错误等等）。 
8 socket.pause()
暂停读取数据。就是说，不会再触发 data 事件。对于控制上传非常有用。 
9 socket.resume()
调用 pause() 后想恢复读取数据。 
10 socket.setTimeout(timeout[, callback])
socket 闲置时间超过 timeout 毫秒后 ，将 socket 设置为超时。 
11 socket.setNoDelay([noDelay])
禁用纳格（Nagle）算法。默认情况下 TCP 连接使用纳格算法，在发送前他们会缓冲数据。将 noDelay 设置为 true 将会在调用 socket.write() 时立即发送数据。noDelay 默认值为 true。 
12 socket.setKeepAlive([enable][, initialDelay])
禁用/启用长连接功能，并在发送第一个在闲置 socket 上的长连接 probe 之前，可选地设定初始延时。默认为 false。 设定 initialDelay （毫秒），来设定收到的最后一个数据包和第一个长连接probe之间的延时。将 initialDelay 设为0，将会保留默认（或者之前）的值。默认值为0. 
13 socket.address()
操作系统返回绑定的地址，协议族名和服务器端口。返回的对象有 3 个属性，比如{ port: 12346, family: 'IPv4', address: '127.0.0.1' }。 
14 socket.unref()
如果这是事件系统中唯一一个活动的服务器，调用 unref 将允许程序退出。如果服务器已被 unref，则再次调用 unref 并不会产生影响。  
15 socket.ref()
与 unref 相反，如果这是唯一的服务器，在之前被 unref 了的服务器上调用 ref 将不会让程序退出（默认行为）。如果服务器已经被 ref，则再次调用 ref 并不会产生影响。 

