# Class

## 变量提升

- Class声明的变量不存在变量提升.必须先声明再使用否则会报错

- Class声明的变量在内部有定义意义.变量名称可以在内部使用

      const a = class Name {
        constructor(){
          console.log(a.name);//Name
        }
      }

## 私有方法

- 用_开头的变量名用来区别
- 在class之外声明私有变量

      class Widget {
        foo (baz) {
          bar.call(this, baz);
        }
        // ...
      }

      function bar(baz) {
        return this.snaf = baz;
      }

- 使用Symbol值得唯一性

      const bar = Symbol('bar');
      const far = Symbol('far');
      export default class myClass{
        // 公有方法
        foo(baz) {
          this[bar](baz);
        }

        // 私有方法
        [bar](baz) {
          return this[snaf] = baz;
        }
        // ...
      };

## Class的静态方法

  类相当于实例的原型,所有定义在类中的方法,都会被实例继承.如果在一个方法之前加上static关键字就表示该方法不会被实例继承而是直接通过类来调用,这就成为类的静态方法

      class Foo {
        static classMethod() {
          return 'hello';
        }
      }

      Foo.classMethod() // 'hello'

      var foo = new Foo();
      foo.classMethod()
      // TypeError: foo.classMethod is not a function

- 静态方法可以与非静态方法重名
- 父类的静态方法可以被子类继承
- 静态方法可以在super对象上调用

      class Foo {
        static classMethod() {
          return 'hello';
        }
      }

      class Bar extends Foo {
        static classMethod() {
          return super.classMethod() + ', too';
        }
      }
      Bar.classMethod() // "hello, too"