# 深拷贝

在 JavaScript 开发工作中，我们经常会碰到需要进行深拷贝的情况，而且在面试中也经常会问到这个问题，什么是深拷贝？

深拷贝的就是在拷贝的时候，需要将当前要拷贝的对象内的所有引用类型的属性进行完整的拷贝，也就是说拷贝出来的对象和原对象之间没有任何数据是共享的，所有的东西都是自己独占的一份

### 如何实现深拷贝

实现深拷贝需要考虑如下几个因素：
- 传入的对象是使用对象字面量{}创建的对象还是由构造函数生成的对象
- 如果对象是由构造函数创建出来的，那么是否要拷贝原型链上的属性
- 如果要拷贝原型链上的属性，那么如果原型链上存在多个同名的属性，保留哪个
- 处理循环引用的问题


代码及参数
```js
function deepClone(obj, cache = new WeakMap()) {
}
```

终止条件
- 如果obj为空 或者obj 不是一个对象 就相当于 他是 string number 的类型 我们直接返回计科
- 如果是 Date 对象 就 new Date() 或 new RegExp() 返回
- 如果在hash表中存在 就直接返回hash的内容

```js
  if(obj == null || typeof obj !=="object") return obj
  if(obj instanceof Date) return new Date(obj)
  if(obj instanceof RegExp) return new RegExp(obj)
  if(cache.get(obj))return cache.get(obj)
```

```js
function deepClone(obj, cache = new WeakMap()) {
  //返回条件
  if(obj == null || typeof obj !=="object") return obj //如果obj为空 或者obj 不是一个对象 就相当于 他是 string number 的类型 我们直接返回计科
  if(obj instanceof Date) return new Date(obj) //如果是 Date 对象 就 new Date() 或 new RegExp() 返回
  if(obj instanceof RegExp) return new RegExp(obj)

  if(cache.get(obj))return cache.get(obj) //如果在hash表中存在 就直接返回hash的内容 

  let cloneObj = new obj.constructor() // 这里就是创建一个 参数对象的原型对象
  cache.set(obj,cloneObj)
  for (const key in obj) {
    if(obj.hasOwnProperty(key)){
      cloneObj[key] = deepClone(obj[key]) //这里就是对象我们刚刚的 if(obj == null || typeof obj !=="object") return obj 这里返回的数据
    }
  }
  return cloneObj
}
let obj = {
  jop:'1',
  arr:[1,2,3],
  obj:{
    name:'小民',
    age:19
  }
}
let obj2 = deepClone(obj)
console.log(obj);
obj2.obj.age=112
console.log(obj2,obj);
```