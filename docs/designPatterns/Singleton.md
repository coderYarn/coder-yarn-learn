# 单例模式

## 介绍
单例模式（Singleton Pattern）是 Java 中最简单的设计模式之一。这种类型的设计模式属于创建型模式，它提供了一种创建对象的最佳方式。

这种模式涉及到一个单一的类，该类负责创建自己的对象，同时确保只有单个对象被创建。这个类提供了一种访问其唯一的对象的方式，可以直接访问，不需要实例化该类的对象。

- 单例类只能有一个实例。
- 单例类必须自己创建自己的唯一实例。
- 单例类必须给所有其他对象提供这一实例。

```ts
class Singleton{
  constructor(){
    if(!Singleton.instance){
      this.list = []
      Singleton.instance = this
    }
    return Singleton.instance
  }
  add(a){
    this.list.push(a)
  }
}
const sing = new Singleton()
sing.add('1')
const sing2 = new Singleton()
sing2.add('2')
console.log(sing.list);
```

```ts
var Singleton = (function () {
  var goodsList = [];
  var instance;
  return function () { // 调用了才会创建实例
    // 保证只有一个实例
    if (!instance) {
      // 实例
      instance = {
        addGood (good) {
          goodsList.push(good);
        },
        showGoodsList () {
          console.log(goodsList);
        }
      };
    }
    return instance;
  };
})();

var a = Singleton()

```
单例模式分为两种：`懒汉式`和`饿汉式`。

## 懒汉式

**懒汉式：使用即创建，即加载时不会创建实例，只有使用时才会创建实例**

上述代码就是一个`懒汉式`的单例模式，具体细节不再讲解。
`Singleton`是一个高级函数，其返回值是一个函数。
`var singleton = (function () {....})`只是加载了一个`singleton`而已，并没有调用，`var a = singleton()`才是正式调用，此时才会进行`if`判断并创建实例。

## 饿汉式
**饿汉式：加载即创建，即加载时就创建了实例，不用是否调用，都已经存在**
将上述代码稍微改写一下

```ts
// ES5中的单例模式
var Singleton = (function () {
  var goodsList = [];
  var instance = { // 加载即创建实例
    addGood (good) {
      goodsList.push(good);
    },
    showGoodsList () {
      console.log(goodsList);
    }
  };
  // 调用的时候直接返回实例，保证只有一个实例
  return function () {
    return instance;
  };
})();

var a = Singleton()
// 在分类页添加了一个商品
a.addGood({id: 1, name: '橘子'})
a.showGoodsList() // 输出：[{id: 1, name: '橘子'}]

var b = Singleton()
// 在商品详情页添加了一个商品
b.addGood({id: 2, name: '苹果'})
b.showGoodsList() // 输出：[{id: 1, name: '橘子'}, {id: 2, name: '苹果'}]

```

## 优点

- 确保了只有一个实例
- 因为只有唯一实例，所以节省了系统资源，记住创建和销毁也需要浪费内存资源
- 避免了对资源的多重占用，比如数据库的连接
- 资源共享