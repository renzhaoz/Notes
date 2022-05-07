# 全局变量

JavaScript 中有一个特殊的对象，称为全局对象（Global Object），它及其所有属性都可以在程序的任何地方访问，即全局变量。
在浏览器 JavaScript 中，通常 window 是全局对象， 而 Node.js 中的全局对象是 global，所有全局变量（除了 global 本身以外）都是 global 对象的属性。
在 Node.js 我们可以直接访问到 global 的属性，而不需要在应用中包含它。

## 常用全局变量

- __filename 表示当前正在执行的脚本的文件名
  输出文件所在位置的绝对路径且和命令行参数所指定的文件名不一定相同.如果是在模块中则返回的值是模块文件的路径.

- __dirname 表示当前执行脚本的所在目录
- 定时器
- console
- process global对象属性,用于描述当前nodejs进程状态的代码,提供了一个与操作系统的简单接口
  process事件:
  1. exit 进程准备退出时触发
  2. beforeExit 当node清空事件循环并没有其他安排时触发
  3. uncaughtException 当有异常冒泡到事件循环时触发 如果给异常添加了监视器 默认打印堆栈跟踪信息并退出就不会发生
  4. Signal 当进程收到信号时就触发

  process有以下常用属性:
    1. execPath 返回当前执行脚本的node二进制文件的绝对路径
    2. env 返回当前shell的环境便令
    3. exitCode 进程退出时的代码 如果通过exit方法退出 不需要指定退出码
    4. version node版本
    5. versions node版本及依赖
    6. config 编译对象
    7. pid 进程id
    8. title 进程名默认为node
    9. arch cpu架构
    10. platform 运行平台
