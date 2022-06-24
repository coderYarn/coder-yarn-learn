# 发布订阅模式

## 前言 
发布订阅模式作为日常开发中经常使用到的模式，小包一直不能做到很好的区分，前几天在听手写 promise 源码时，老师详细的讲解了两种模式，发现自己还是很难吃透。
今天我就用点小案例来帮助大家理解透彻 `发布订阅模式`

### 场景
假设我们想租一个房租，我们平时嘛，肯定没有精力也没有资源去找的，然后我们就需要借助中介公司来帮助我们寻找这样的房子。我们把要求罗列出来给到房产中介，中介会整理出来，贴在一个布告栏里。这时候条件合适的房东想出租房子就会通过中介找到我们，和我们交流信息，这就是大概的流程了

![ReleaseSubscription1](/designPatterns/ReleaseSubscription/ReleaseSubscription1.jpg)

## 代码实现

```typescript
class EventBus{
  constructor(){
    this.events = {}
  }
  emit(key,task){//订阅
    if(!this.events[key]){
      this.events[key]=[]
    }
    this.events[key].push(task)
  }
  on(key,...args){//发布
    if(this.events[key]){
      this.events[key].forEach(fn =>fn(...args));
    }
  }
}

let event = new EventBus()//中介
event.emit('key1',(...arg)=>{//订阅
  console.log(arg);
})
event.emit('key2',(...arg)=>{//订阅
  console.log(arg);
})
event.on('key1','1','2',3)//发布
event.on('key2','key2')//发布

```