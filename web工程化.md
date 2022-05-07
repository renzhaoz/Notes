# web模块化

## 模块化方案

### CommonJs 同步加载
  
  动态引入 url可以为变量 输出值的拷贝 运行时加载 伴随着NodeJs的出世而产生 为了让Js能有服务端的能力而开发而出的产物

- 导入导出
导入/导出-require/exports

      //导出 a.js
      module.exports = {
        name:xxx
      }
      // 导入
      const md = require(`./${a}.js`) // 这里的url可以是动态的拼接变量

- 主要实例
nodeJs

- 只要使用环境
nodeJs

### AMD 异步加载

与CommonJs相对应.CommonJs是同步执行的.AMD则恰恰相反.它采用异步加载方案 不会影响和阻塞引入模块后面语句的执行 所有相关模块的应用都在其成功回调的回调中 所以常用于浏览器

- 导入导出

      // 导出 a.js
      define(function(){
        return {
          name:xxx
        }
      });
      // 导入
      require('a.js',function(moduleA){
        // 异步执行的 当模块A引入后才会调用callback
        console.log(moduleA.name);
      })

- 主要实例
  客户端/浏览器 require.js curl.js

- 主要应用环境
  客户端/浏览器

> 能在普通web项目中使用吗?
> 可以 但是需要引入require.js才能使用AMD形式的模块化开发方案 AMD还可以 #合并多个模块 减少HTTP请求 # 也可以延迟执行

### CMD 延迟执行

CMD是SeaJs产生时的产物 CMD推荐就近依赖用之前再引入不用则不引入 AMD恰恰相反推荐引入后再用

- 导入导出

      // 导出 a.js
      define(function(require,exports,module){
        // 模块代码
        module.exports = {
          getName: ()=>{
            const a = require('a.js');
            return a;
          }
        }
      });

      define('hello',['jquery'],function(require,exports,module){
        // 模块代码依赖jquery
      })


      // 导入
      require(moduleName);
      require.async(moduleName,callback);
      require.resolve(moduleName); // 不加载模块 仅仅将短串解析成完整路径
  
- 主要实例
  seaJs
- 主要应用环境
  seaJs

### EsModule 静态导入 支持异步导入

EsModule是JavaScript执行自身演化所产生的模块化方案,也是目前web开发场景应用最多的模块化方案.

- 导入导出

      //导出a.js
      export = {
        name:xxx
      }
      // 导入
      // import...from...
      import Module from './a.js';
      // script标签导入
      <script type="module" >
        import jq from './jquery.js';
      </script>
      // http导入
      const jq = await import('https://www.baidu.com');
      // http导入模块下的多个子集
      <script type="importmap">
        {
          imports:{
            loadsh:'http://cdn.skypack.dev/lodash',
            ms:'http://ms.com'
          }
        }
      </script>
      <script type='module'>
        import get from 'lodash/get.js';
      </script>
      // 导入json等其他资源
      <script type="module">
        import json from './user.json' assert {type:'json'};
        console.log(json);
      </script>



- 主要实例
  Vite Web开发 NodeJs

- 主要应用环境
  应用开发 Web应用

> 静态导入 所以可以进行tree shaking 输出值得引用 编译时加载

### UMD

UMD规范是AMD和CommonJs的糅合. 可以同时支持nodeJs环境require引入和浏览器端通过src引入 需要自己写判断

- 导入导出

      (function(root,factory){
        if(typeof define === 'function' && define.amd){
          // AMD
          define(['jquery'],factory);
        } else if(typeof exports === 'object'){
          // CommonJs
          module.exports = factory(require('jquery'));
        } else {
          // src 引入全局变量 
          root.returnExports = factory(root.jquery);
        }
      })(this,function($){
        // 开始使用Jquery
      })

- 主要实例
  react-table antd

- 主要应用环境
  同时支持node环境和浏览器环境的第三方支持插件及ui.例react-table antd

同时支持CommonJs及AMD

### 模块间的转化

由于Bundless构建工具的兴起要求所有的模块是EsModule.
CommonJs -> EsModule @rollup/plugin-commonjs
https://cdn.skypack.dev/
https://jspm.org

### 小结

CommonJS - NodeJs环境的模块化方案 输出是值的拷贝 运行时加载
EsModule - JS官方的模块化方案 支持同步异步导入 编译时加载
AMD - 异步模块导入方案 大量适用于浏览器开发 异步导入 运行时已经加载完成 所以是提前加载(依赖前置)
CMD - Seajs实现的模块化方案 相较于AMD 属于延迟加载(AMD也支持延迟加载了)用时再加载执行(依赖就近原则)
UMD - 一种跨平台的支持方案(兼容AMD/CommonJS/全局变量) 判断当前模块是哪一种 然后根据各模块的引入方式引入不同类型的模块 如果都不匹配则将该模块置为全局变量(挂载到window或者global全局对象上)

> web应用开发中可以直接使用的模块化方案:
> EsModule、AMD(需要引入requirejs模块才能使用)、UMD(本身就是一种兼容写法,主要看你导出的包是那种类型)
> commonJs只能在服务端nodeJs使用
> CMD其实就只能在使用SeaJs时用用
> 所以做web前端模块化开发其实只需要关注EsModule、AMD、UMD就足够了 有时间可以了解下其他两种 当然也就是学习nodeJs SeaJs.

## AST

AST是Abstract Syntax Tree的简称，是前端工程化绕不过的一个名词，涉及工程化多个环节:
TypeScript -> JavaScript
Sass/Less -> CSS
ES6 -> ES5(babel)
JavaScript 格式化(eslint/prettier)
JSX -> JavaScript
GraphQL、MDX、Vue SFC
...

在语言转换过程中实际上就是对其AST的操作.核心步骤就是下面三步:
  Code -> AST(parse)
  AST -> AST(Transform)
  AST -> Code(Generate)

      // Code
      const a = 4;
      
      // AST
      {
        type: 'Program',
        start:0,
        end:11,
        body:[{
          type:'VariableDeclaration',
          start:0,
          end:11,
          declarations:[
            {
              type:'VariableDeclaration',
              start:6,
              end:11,
              id:{
                type:'Identifier',
                start:6,
                end:7,
                name:'a'
              },
              init:{
                type:'Literal',
                start:10,
                end:11,
                value:4
                raw:'4'
              }
            }
          ],
          kind:'const'
        }],
        sourceType:'module'
      }

> 不同的语言有不同的解析器 JavaScript和Css的解析器就完全不同。对于相同的语言也有不同的解析器也会生成不同的AST,例如JavaScript的babel与espree.

### 生成AST

生成AST的这一过程也叫解析该步骤有两个阶段:

1. 词法分析
将代码转化为Token流 维护一个关于Token的数组.Token流也有诸多应用

   - 代码检查 例如eslint判断是否以分号结尾
   - 语法高亮,highlight/prism
   - 模板语法,ejs

2. 语法分析
将Token流转化为结构化的AST.

## Webpack生成了什么(webpack如何加载模块化的JS)

webpack runtime ? - webpack在进行了一系列操作之后生成了什么样的代码 做了什么操作？
只要有以下三步:

1. ```__webpack_modules__```: 维护一个所有模块的数组.将入口解析为AST，根据AST深度搜索所有的模块并构建这个数组.每个模块都由一个包裹函数```(module,module.exports,__webpack_qeruiew__)```对模块进行包裹构成.

2. ```__webpack_require__(moduleID)```:手动实现加载一个模块。对已加载过的模块进行缓存,对未加载的模块执行id定位到```__webpack_modules__```中的包裹函数,执行并返回```module.exports```并缓存

3. ```__webpack_require__(0)```: 运行第一个模块入口模块

webpack runtime简缩实现:

      const __webpack_modules__ = [()=>{}];
      const __webpack_require = (id) => {
        const module = {exports:{}};
        const m = __webpack_modules__[id](module);
        return module.exports;
      }
      __webpack_require__(0);

## webpack加载非JS文件(图片/JSON)

一切皆模块,在webpack中所有的资源都是被当做模块来加载的.导入过程需要使用各种各样的loader.

- JSON

      import json from './use.json';
      
      // use.json内容
      {
        id:'moduleID',
        name:'haha',
        url:'baidu.com'
      }
       
      // loader 编译后
      export default {
        id:'moduleID',
        name:'haha',
        url:'baidu.com'
      }

- IMG

      import Img from './Img.png';
      
      // loader转化后
      export default `$PUBLIC_URL/imgPath/Img.png`;

## webpack构建优化

- 持久化缓存
webpack5 - {cache:{type:'filesystem'}}
webpack4 - cache-loader第三方插件

- 多进程(硬件支持)
webpack5 - thread-loader
webpack4 - happypack-plugin

## webpack构建体积优化

- 体积分析
- JavaScript/Html/Css/image压缩
- Tree Shaking/Death Code
npm.devtool.tech可以查看某个库是否支持Tree Shaking
- Polyfill:coreJs用于Es降级或者补充 一般浏览器版本越低 该包越大
coreJs包含了所有Es6+的polyfill,并集成在babel / @babel/preset-env / @babel/polyfill等编译工具中.

