# Generator入门

## 简介

Generator函数是ES6提供的一种异步编程解决方案.该语法行为与传统函数完全不同.类似于任务调度.
相当于一个状态机,封装了多个内部状态.

## 起步API

执行Generator函数会返回一个遍历器对象,也就是说Generator除了状态机还是一个遍历器对象生成函数```Iterator```.返回的遍历器对象可以依次遍历Generator函数内部的每一个状态.以下是一个简单的实例:

      function *addNumber(){
        yield '1';
        yield '2';
        return '只能运算两次';
      }

> 注意:
Generator形式上是一个普通函数.但有两个特征:1.function关键字与函数名之间有一个星号;2.函数内部使用yield表达式,用于定义不同的内部状态.

## 特点

      function *addNumber(){
        yield '1';
        yield '2';
        return '只能运算两次';
      };

- 调用addNumber();后并不会执行addNumber函数.会返回一个指向内部状态的指针对象，也就是遍历器对象Iterator,对象上会有next方法.

- 多次调用Iterator的next方法,依次返回yield表达式对应的值,直到返回对象的done的值为true,再次调用返回对象的value将为undefined.例下:

      const gen = addNumber();
      gen.next(); // {value: "1", done: false}
      gen.next(); // {value: "2", done: false}
      gen.next(); // {value: "只能运算两次", done: true}
      gen.next(); // {value: undefined, done: true}

- 当第一次调用next方法时,Generator函数开始执行,直到遇到第一个yield表达式为止.然后返回对象的value值为yield表达式的值,done属性的值false,表示便利还为结束

- 第二次调用next方法. Generator函数从上次yield表达式停下的地方开始,一直执行到下一个yield表达式.将继续返回对应值.

- 第三次执行next方法. Generator函数从上次yield表达式停下的地方开始,一直执行到return语句(如果没有return则执行到函数结束). next方法返回对象对应value值为return的值,如果没有return语句则value属性的值为undefined.done的值从false变为true.

- 第四次调用next方法. Generator函数已经运行完毕,next方法返回对象的value值为undefined,done值为true.以后再调用值都保持一样.

- 当yield表达式对应的值为运算式不是值时,只有当调用next方法时,内部指针指向该语句时才会执行(Generator函数执行到yield表达式时会暂停执行),因此等于为javascript提供了手动的'惰性求值'的语法功能.例下:

      function * set(){
        yield 123 + 123;
      }

- 只有在Generator函数中才能使用yield表达式.其他函数中使用yield将会报错(例forEach).for循环可以

      var arr = [1, [[2, 3], 4], [5, 6]];
      var flat = function* (a) {
        a.forEach(function (item) {
          if (typeof item !== 'number') {
            yield* flat(item);
          } else {
            yield item;
          }
        });
      };
      for (var f of flat(arr)){
        console.log(f);
      }

- yield表达式如果在一个表达式中,则必须放在圆括号里.

      function * hello() {
        console.log('hello' + yield); // 报错
        console.log('hello' + (yield 123)) // OK
        console.log('hello' + (yield)); // OK
      }

- yield表达式作为函数参数或者作为赋值表达式时可以不加括号

      function* demo() {
        foo(yield 'a', yield 'b'); // OK
        let input = yield; // OK
      }