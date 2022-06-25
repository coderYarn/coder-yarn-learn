# MVVM
- 这篇文章其实没有什么鸟用，只不过对于现在的前端面试而言，已经是一个被问烦了的考点了
- 既然是考点，那么我就想简简单单的来给大家划一下重点

## MVC
在了解MVVM之前我们首先说一下MVC,MVC架构诞生在后端并一直延续之前,一直是我们做SEO一个最佳的选择之一,因为前端页面直接存在了服务器之中。


![MVVM1](/coder-yarn-learn/designPatterns/MVVM/mvvm1.jpg)


### MVC分为三成架构分别是
下面以 Java 为例，分别阐述下MVC和三层架构中各层代表的含义以及职责：
- M：*Model*模型层,代表着每一个JavaBean。其分为两类，一类称为数据承载Bean，一类称为业务处理Bean。前端的朋友可以理解为数据库里的数据
- V：*View*视图层，代表着对应的视图页面，与用户直接进行交互。
- C: *Controller*控制层，该层是Model和View的“中间人”，用于将用户请求转发给相应的Model进行处理，并处理Model的计算结果向用户提供相应响应

以列表为例，介绍一下三层模型的之间的逻辑关系，当用户点击*View*视图页面的翻页的时候，系统会调用*Controller*控制层里的翻页接口。然后接口会去找到*Model*里的对应数据，然后刷新*View*视图层的页面

## MVVM

1. M:*Model* 数据模型（Model），简单的JS对象
2. VM:*ViewModel* 视图模型（ViewModel），连接Model与View
3. V: *View* 视图层（View），呈现给用户的DOM渲染界面

![MVVM2](/coder-yarn-learn/designPatterns/MVVM/mvvm2.jpg)

通过上图我们可以看到*ViewModel*是MVVM中最重要的核心，它的主要作用:对View中DOM元素的监听和对Model中的数据进行绑定,当View变化了也会引起Model中的改变，Model中的数据发生变化也会触发View视图的页面重新渲染，从而达到数据双向绑定的效果，该效果也是Vue最为核心的特性。

### 常见库的数据双向绑定的做法:
- 发布订阅模式（Backbone.js）
- 脏值检查（Angular.js）
- 数据劫持（Vue.js）

面试者在回答Vue的双向数据绑定原理时，几乎所有人都会说：Vue是采用数据劫持结合发布订阅模式，通过Object.defineProperty()来劫持各个属性的getter,setter, 在数据变动时发布消息给订阅者，触发相应的回调函数，从而实现数据双向绑定。但当继续深入问道：

- 实现一个MVVM里面需要那些核心模块？
- 为什么操作DOM要在内存上进行？
- 各个核心模块之间的关系是怎样的？
- Vue中如何对数组进行数据劫持？
- 你自己手动完整的实现过一个MVVM吗？

接下来，我将一步一步的实现一套完整的MVVM，当再次问道MVVM相关问题，完全可以在面试过程中脱颖而出。在开始编写MVVM之前，我们很有必要对核心API和发布订阅模式熟悉一下：

`注：我们这次不用 Object.defineProperty() , 用new Proxy()`
## 介绍一下 new Proxy(target, handler) 的使用
Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

```js
const p = new Proxy(target, handler)
```
1. *target*: 要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
2. *handler*: 一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。


## 实现自己的 MVVM
要实现mvvm的双向绑定，就必须要实现以下几点

1. 实现一个数据劫持 - Observer，能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者
2. 实现一个模板编译 - Compiler，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数
3. 实现一个 - Watcher，作为连接Observer和Compile的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图
4. MVVM 作为入口函数，整合以上三者

![MVVM3](/coder-yarn-learn/designPatterns/MVVM/mvvm3.jpg)

数据劫持 - Observer

`reactive 类主要目的就是给 data 数据内的所有层级的数据都进行数据劫持，让其具备监听对象属性变化的能力`
【重点】:
1. 当对象的属性值也是对象时，也要对其值进行劫持 --- 递归
2. 当对象赋值与旧值一样，则不需要后续操作 --- 防止重复渲染
3. 当模板渲染获取对象属性会调用get添加target，对象属性改动通知订阅者更新 --- 数据变化，视图更新

### 数据劫持
【重点】：

1. 当对象的属性值也是对象时，也要对其值进行劫持 --- 递归
2. 当对象赋值与旧值一样，则不需要后续操作 --- 防止重复渲染
3. 当模板渲染获取对象属性会调用get添加target，对象属性改动通知订阅者更新 --- 数据变化，视图更新

```js
function reactive(obj) {
  let dep = new Dep()
  if (!isObject(obj)) {
    return obj
  }
  const proxy = new Proxy(obj, {
    get(target, p, receiver) {
      let result = Reflect.get(target, p, receiver)
      Dep.target && dep.addSub(Dep.target)
      return isObject(result)?reactive(result):result
    },
    set(target, p, val, receiver) {
      if (val !== target[p]) {
        let result = Reflect.set(target, p, val, receiver)
        console.log(target[p]);
        dep.notify()
        return result
      }
    }
  })
  return proxy
}
function isObject(value) {
  return typeof value === 'object' && value !== null;
}
```

### 模板编译 - Compiler

Compiler 主要做了三件事：
- 将当前根节点所有子节点遍历放到内存中
- 编译文档碎片，替换模板（元素、文本）节点中属性的数据
- 将编译的内容回写到真实DOM上
【重点】：

1. 先把真实的 dom 移入到内存中操作 --- 文档碎片
2. 编译 元素节点 和 文本节点
3. 给模板中的表达式和属性添加观察者
```js
class Compile {
  constructor(el, vm) {
    this.el = document.querySelector(el)
    let fragment = this.fragmentNode2(this.el)
    this.compile(fragment, vm)
    this.el.appendChild(fragment)
  }
  compileElement(child, vm) {
    const attributes = child.attributes;
    [...attributes].forEach(attr => {
      let {
        name,
        value
      } = attr;
      switch (name) {
        case 'v-model':
          this.disposeElement(vm, 'input', value, child, this.setVal)
        default:
          break;
      }
    })
  }
  compileText(child, vm) {
    const content = child.textContent.trim();
    if (/\{\{.+?\}\}/.test(content)) {

      this.disposeText(vm, content.match(/\{\{(.+?)\}\}/)[1].trim(), child)
    }
  }
  disposeElement(vm, name, value, node, setVal) {
    new Watcher(vm, value, (newValue) => {
      node.value = newValue
    })
    node.addEventListener(name, function (e) {
      setVal(vm, value, node, e.target.value)
    })
    node.value = this.getVal(vm, value)
  }
  disposeText(vm, text, node) {
    new Watcher(vm, text, (newVal) => {
      node.textContent = newVal
    })
    node.textContent = this.getVal(vm, text)
  }
  setVal(vm, key, node, value) {
    vm.data[key] = value
  }
  getVal(vm, text) {
    const value = text.split('.').reduce((data, current) => {
      return data[current]
    }, vm.data)
    return value
  }
  compile(el, vm) {
    let childrens = el.childNodes;
    [...childrens].forEach(child => {
      if (child.nodeType === 1) {
        this.compileElement(child, vm)
        this.compile(child, vm)
      } else {
        this.compileText(child, vm)
      }
    })
  }
  fragmentNode2(el) {
    let fragment = document.createDocumentFragment()
    let firstChild
    while (firstChild = el.firstChild) {
      fragment.appendChild(firstChild)
    }

    return fragment
  }
}


```

### 发布订阅
1. 在自身实例化时往属性订阅器(dep)里面添加自己
2. 自身必须有一个update()方法
3. 待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。

```js
// 发布订阅
class Dep {
  static target
  constructor() {
    this.observers = []
  }
  addSub(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }

  }
  notify() {

    this.observers.forEach(observer => {
      observer.update()
    });
  }
}
class Watcher {
  constructor(vm, exp, fn) {

    this.exp = exp

    this.vm = vm
    this.fn = fn;
    Dep.target = this;
  }
  update() {
    let val = this.exp.split('.').reduce((data,cur)=>{
      return data[cur]
    },this.vm.data)
    this.fn(val)
  }
}


```
Dep 和 Watcher 是简单的观察者模式的实现，Dep 即订阅者，它会管理所有的观察者，并且有给观察者发送消息的能力。Watcher 即观察者，当接收到订阅者的消息后，观察者会做出自己的更新操作。

### 整合 - MVVM

```js
class Mvvm {
  constructor({
    el,
    data
  }) {

    this.data = reactive(data)
    new Compile(el, this)
  }
}

```

## 总结
通过以上描述和核心代码的演示，相信小伙伴们对MVVM有重新的认识，面试中对面面试官的提问可以对答如流。希望同行的小伙伴手动敲一遍，实现一个自己MVVM，这样对其原理理解更加深入。