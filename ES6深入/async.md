# async应用实践

## async状态管理

- async函数返回一个Promise对象.该对象等到内部所有await命令后面的Promise对象执行完毕才会发生改变.
- async函数返回一个Promise对象.该对象遇到return语句或者抛出错误时状态发生改变.也就是说只有async函数内部的异步函数操作执行完才会调用执行then方法指定的函数回调.
- async函数如果返回一个非Promise值则会被强制转换成Promise对象.(返回一般对象则相当于返回Promise.resolve().返回Error对象或者async函数运行出错则相当于返回Promise.reject())
      // demo1
      async function f() {
        return 'hello world';
      }
      f().then(s => console.log(s)) // hello world

      // demo2
      async function f() {
        throw new Error('出错了');
      }
      f().then(e => console.log(e))); // 出错了

- async函数如果有多个await语法,只要一个await后面的Promise状态变为reject则整个async函数都会中断执行并执行reject()函数返回错误.

      // demo3
      async function f() {
        await call1();
        await call2();
      } // call1运行错误则call2不会执行 避免该行为可使用try...catch...语法

## 错误处理

- await后面的Promise代码运行出错调用自身的reject函数,那么async函数本身的reject方法也会被执行
- 如果有多个await语句为了避免其中一个抛出错误或者执行错误导致整个async函数中止,一般使用try...catch...包裹

      // demo1
      async function main() {
        try {
          const val1 = await firstStep();
          const val2 = await secondStep(val1);
          const val3 = await thirdStep(val1, val2);
          console.log('Final: ', val3);
        }
        catch (err) {
          console.error(err);
        }
      } // val1值对应的Promise执行出错或者抛出错误val2 val3还是会执行 不会中止
      
      //demo2
      async function myFunction() {
        await somethingThatReturnsAPromise()
          .catch(function (err) {
            console.log(err);
          });
        }

## 并发

- 当有多个await语句但是执行顺序不影响程序结果时应让其并发执行.减少其执行耗时.

      // 第二个await必须等到第一个执行完后才会执行
      let foo = await getFoo();
      let bar = await getBar();

      // 优化后
      let [foo, bar] = await Promise.all([getFoo(), getBar()]); // 优化写法1 借用promiseAll
      
      // 优化写法2 将Promise写成声明函数 await获取返回值
      let fooPromise = getFoo();
      let barPromise = getBar();
      let foo = await fooPromise;
      let bar = await barPromise;

- 多个await循环执行时只能使用for循环调用,forEach循环会报错.