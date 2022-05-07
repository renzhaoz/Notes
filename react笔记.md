# React核心概念

## 生命周期

- 装载
  1. constructor
  2. getInitialState // React.createClass方法创造的组件类才会有
  3. getDefaultProps // React.createClass方法创造的组件类才会有
  4. componentWillMount
  5. render
  6. componentDidMount

> 注意
> 当组件存在父子嵌套关系时:
> 1.constructor、componentWillMount、render先父到子按顺序执行
> 2.等所有组件中constructor、componentWillMount、render调用完毕之后。componentDidMount从子组件到父组件依次调用

- 更新
  1. componentWillReceiveProps(nextProps)
  2. shouldComponentUpdate(nextProps,nextState)
  3. componentWillUpdate
  4. render
  5. componentDidUpdate

> componentWillReceiveProps的调用时机->父级调用render方法,而并不是只有props发生变更时才调用。组件自身调用setState并不会调用该生命周期,因为我们常在该组件中通过改变的props重新计算state然后调用setState重新赋值,若调用componentWillReceiveProps就会进入死循环。
> shouldComponentUpdate该生命周期通常决定是否需要继续走下来的生命周期,也就是决定是否渲染当前组件,return false;即表示终止渲染,反之继续

- 卸载
  1.componentWillUnmount

> 卸载的生命周期只有一个componentWillUnmount.当组件要从DOM上清理之前该函数会被调用。常在该函数中进行清理工作

## 模块化开发

- 按功能组织组件分类,降低模块之间的关联,最佳实现是模块单独拉出来可以独立运行
- 按功能设计数据结构,数据store位置,数据扁平化处理

## 性能优化

题外话-性能优化从来不是一个独立的话题或者最后要考虑的话题,每个coder应该要在码代码时就应该考虑.往往显著的性能问题会被迅速解决,最耗时最复杂的是那些不经意的,考虑不到的,个人能力导致的性能问题,即使这部分只影响性能的10%,才往往是最难解决的,有的还需要代码重构.每位coder在长期的工作学习中往往有很大的进步,所以周期性的代码审计以及评审是一个很重要很必要的工作.

- 单个组件的性能优化
  1. shouldComponentUpdate
  2. pureComponent
  3. `<Foo style={{color :”red”}} />` 每次渲染都认为style是一个新值 类似的传值也要避免,下面是正确的写法:

          const fooStyle = {color ：” red”｝// 确保这个初始化只执行一次， 不要放在render 中
          <Foo style={fooStyle) />
  4. 和3类似的props也尽量要让props的值指向同一个对象地址

          // 错误写法,这样每次通过onToggle取得的都是一个新的函数
          onToggle= {() => onToggleTodo ( itern. id))
          // 正确写法
          onToggle= {this.onToggleTodo}

- 多个组件的性能优化
  1. componentWillUnmount 清理
  2. Reconciliation调和过程优化
     - 设置唯一key
- 利用reselect提高数据选取的性能(redux插件)

## 工具

### chrome工具

- React Devtools 查看组件嵌套关系
- Redux Devtools 查看Redux数据流
- React Perf 查看React渲染性能

## 其他

### 动画

- react-addons-css-transition-group css实现的动画方案
插件react-addons-css-transition-group可以添加组件的加载卸载动画

- react-motion js实现的动画方案
