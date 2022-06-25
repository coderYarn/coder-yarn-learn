# new & call & apply & bind

```js
function Son(name){
  this.name = name
}
function myNew(fn,...args){
  const obj = {} //创建新元素
  obj.__proto__ = fn.prototype //改变原型链指向
  fn.apply(obj,args)//修改this指向
  return obj //返回
}
let son = myNew(Son,'123')
function person(a, b, c, d,e) {
  console.log(a, b, c, d,e, this.name);
}
Function.prototype.MyCall = function (obj, ...args) {
  obj = obj || window //获取对象
  obj.p = this; //拿到函数本体
  let result = obj.p(...args) //调用函数
  delete obj.p //删除函数
  return obj //返回结果
}
Function.prototype.MyApply = function (obj, args) {
  obj = obj || window //获取对象
  obj.p = this; //拿到函数本体
  let result = obj.p(...args) //调用函数
  delete obj.p //删除函数
  return obj //返回结果
}
Function.prototype.MyBind = function (obj, args) {
  let that = this
  return function (){
    // obj = obj||window 
    // obj.p = that
    // let result = obj.p(...args,...arguments)
    // delete obj.p
    // return result
    that.MyApply(obj,[...arguments,...args])
  }
}
let obj = {
  name: '小明'
}
let a = person.MyBind(obj, [1, 2, 3, 4])
a(5)
a(6,2)

```