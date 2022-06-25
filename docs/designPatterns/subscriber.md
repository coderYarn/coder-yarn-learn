# 观察者模式

当对象间存在一对多关系时，则使用观察者模式（Observer Pattern）。比如，当一个对象被修改时，则会自动通知依赖它的对象。观察者模式属于行为型模式。
观察者模式是一种对象行为型模式，其主要优点如下。
- 降低了目标与观察者之间的耦合关系，两者之间是抽象耦合关系。符合依赖倒置原则。
- 目标与观察者之间建立了一套触发机制。

它的主要缺点如下。
- 目标与观察者之间的依赖关系并没有完全解除，而且有可能出现循环引用。
- 当观察者对象很多时，通知的发布会花费很多时间，影响程序的效率。

### 假设场景
有一位农名工是抹灰的，然后它找到了一个包工头，加入了包公头的团队。包工头就会去收集拿到农民工的手机号，下次有活的时候就会去通知这位农民工干活了。

![subscriber1](/coder-yarn-learn/designPatterns/subscriber/subscriber1.jpg)

## 代码实现

```typescript

// 观察者
class Observer {
  constructor(info) {
    this.observer = info;
  }
  update({type,info}){
    if(type!==this.observer.jop){
      console.log(`${this.observer.name}做不了抹灰工`);
      return;
    }
    this.notify(info)
  }
  notify(info) {
    console.log(`${this.observer.name} has been notified.`,info);
  }
}
// 观察目标
class Subject {
  constructor() {
    this.observers = []
  }
  addObserver(observer) {
    this.observers.push(observer);
  }
  deleteObserver(observer) {
    let idx = this.observers.indexOf(observer)
    idx != -1 && this.observers.splice(idx, 1)
  }
  notifyObservers({type,info}) {
    this.observers.forEach(observer => {
      observer.update({type,info})
    });
  }
}

// ObserverPattern.tsfunction
function useObserver() {
  const subject = new Subject();
  const Leo = new Observer({name:"Leo",jop:"抹灰"});
  const Robin = new Observer({name:"Robin",jop:"抹灰"});
  const Pual = new Observer({name:"Pual",jop:"板砖"});
  const Lisa = new Observer({name:"Lisa",jop:"挖地"});
  console.log(subject);
  subject.addObserver(Leo);
  subject.addObserver(Robin);
  subject.addObserver(Pual);
  subject.addObserver(Lisa);

  // subject.deleteObserver(Pual);
  // subject.deleteObserver(Lisa);
  subject.notifyObservers({type:'抹灰',info:"快走！！！"});
}
useObserver();
```