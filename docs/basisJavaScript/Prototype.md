# 原型 & 原型链

## 原型
### 概念
原型是Javascript中的继承的基础，JavaScript的继承就是基于原型的继承。

在Javascript中，我们创建一个**函数A**的时候，那么浏览器就会在内存中创建一个**对象B**，每个函数都会默认有一个属性*prototype*指向这个对象。这个**对象B**就是**函数A**的原型对象，简称函数的原型，这个**对象B**默认会有一个*constructor* 属性指向 **函数A**

```js
  function A(){

  }
  console.log(A.prototype) //{constructor: ƒ}
  console.log(A.prototype.constructor == Person) //true

```

## 原型链
### 概念
每个对象都可以有一个原型，这个原型还可以有它自己的原型，以此类推，形成一个原型链。查找特定属性的时候，我们先去这个对象里去找，如果没有的话就去它的原型对象里面去，如果还是没有的话再去向原型对象的原型对象里去寻找...... 这个操作被委托在整个原型链上，这个就是我们说的原型链了。

```js
  class Person {
    constructor(){

    }
  }

  let person = new Person()
  class Son extends Person{
    constructor(){
      super()
    }
  }
  let son = new Son()
  console.log(Person.prototype == son.__proto__.__proto__);//一直追溯 
  
  //instanceof 的原理 也是如此
  function instanceOf(father,child){
    if(child === null )return false
    if(father.prototype == child.__proto__)return true
    return instanceOf(father,child.__proto__)
  }

```