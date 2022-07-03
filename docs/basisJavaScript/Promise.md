
# Promise

## 描述
一个 `Promise` 对象代表一个在这个 `promise` 被创建出来时不一定已知值的代理。它让你能够把异步操作最终的成功返回值或者失败原因和相应的处理程序关联起来。这样使得异步方法可以像同步方法那样返回值：异步方法并不会立即返回最终的值，而是会返回一个 `promise`，以便在未来某个时候把值交给使用者。

一个 Promise 必然处于以下几种状态之一：

- *待定（pending）*：初始状态，既没有被兑现，也没有被拒绝。
- *已兑现（fulfilled）*：意味着操作成功完成。
- *已拒绝（rejected）*：意味着操作失败。

待定状态的 `Promise` 对象要么会通过一个值被兑现，要么会通过一个原因（错误）被拒绝。当这些情况之一发生时，我们用 `promise` 的 `then` 方法排列起来的相关处理程序就会被调用。如果 promise 在一个相应的处理程序被绑定时就已经被兑现或被拒绝了，那么这个处理程序也同样会被调用，因此在完成异步操作和绑定处理方法之间不存在竞态条件。

## 代码实现
```typescript
//状态
enum promiseStatus {
  PEDDING = 'PEDDING',
  REJECTED = "REJECTED",
  FULFILLED = 'FULFILLED'
}
interface PromiseCallback<T> {
  (value?: T): void | MyPormiseInterface
}
interface MyPormiseInterface {
  reson: any
  status: promiseStatus
  onRejectedCallbacks: Array<PromiseCallback>
  onResolveCallbacks: Array<PromiseCallback>
  then: (onResolved: PromiseCallback, onRejectd?: PromiseCallback) => MyPormiseInterface
  catch: (onRejectd: PromiseCallback) => MyPormiseInterface
  resolve: (value: any) => void
  reject: (value: any) => void

} 
interface PromiseHandle {
  (resolve: (value?: any) => void, REJECTED: (value?: any) => void): void
}
export class MyPromise implements MyPormiseInterface {
  private  value: any
  reson: any
  status: promiseStatus
  onRejectedCallbacks: Array<PromiseCallback>
  onResolveCallbacks: Array<PromiseCallback>
  constructor(handle: PromiseHandle) {
    this.value = null;
    this.reson = null;
    this.onRejectedCallbacks = []
    this.onResolveCallbacks = []
    this.status = promiseStatus.PEDDING;
    handle(this.resolve.bind(this), this.reject.bind(this))
  }
  static all(promises: MyPormiseInterface[]): MyPormiseInterface {
    return new MyPromise((onResolved: PromiseCallback, onRejectd: PromiseCallback) => {
      let result: any[] = []
      let count = 0
      promises.forEach((item, index) => {
        item.then(res => {
          result[index] = res;
          count++
          if (count === promises.length) {
            onResolved(result)
          }
        })
        item.catch(e => {
          onRejectd(e)
        })
      })
    })
  }

  then(onResolved: PromiseCallback, onRejectd?: PromiseCallback): MyPormiseInterface {
    onResolved = typeof onResolved === 'function' ? onResolved : (value) => value;
    onRejectd = typeof onRejectd === 'function' ? onRejectd : (err) => {
      throw err
    };
    // then方法会返回一个新的promise对象，以便使用then方法接收结果
    let promiseNew = new MyPromise((resolve, reject) => {
      // 封装一个成功时执行的函数
      let fulfilled = (value: any) => {
        try {
          // 拿到返回值resolve出去
          let result = onResolved(value);
          // 判断是否是Promise
          /*
            判断返回的是否是promise，这里的resolve，reject是
            返回的新promise的成功/失败的接收函数
          */
          this.isPromise(promiseNew, result, resolve, reject);
        } catch (error) {
          reject(error)
        }
      };

      // 封装一个失败时执行的函数
      let rejected = (err: any) => {
        try {
          // 拿到返回值reject出去
          let result = onRejectd && onRejectd(err);
          this.isPromise(promiseNew, result, resolve, reject);
        } catch (error) {
          reject(error)
        }
      };
      if (this.status === promiseStatus.FULFILLED) {
        fulfilled(this.value);
      } else if (this.status === promiseStatus.REJECTED) {
        rejected(this.reson);
      } else if (this.status === promiseStatus.PEDDING) { // 新增等待态判断，此时异步代码还未走完，回调入数组队列
        this.onResolveCallbacks.push(fulfilled);
        this.onRejectedCallbacks.push(rejected);
      }

    })

    return promiseNew;

  }
  // 判断是否是Promise
  private isPromise(promiseNew: any, callValue: any, resolve: any, reject: any) {
    // 如果相等了，说明return的是自己，抛出类型错误并返回
    if (promiseNew === callValue) {
      return reject('请避免Promise循环引用')
    }
    if (callValue instanceof MyPromise) {
      // 如果当前回调函数返回Promise对象，必须等待其状态改变后在执行下一个回调
      // 调用上一次then中成功回调返回的型promise的then方法
      callValue.then(resolve, reject);
    } else {
      // 如果是一个非Promise数值，那么就直接调用返回 ---- promise特性
      resolve(callValue);
    }
  }
  resolve(value: any): void {
    if (this.status === promiseStatus.PEDDING) {
      this.status = promiseStatus.FULFILLED
      this.value = value
      this.onResolveCallbacks.forEach(fn => fn(this.value))
    }
  }


  reject(value: any): void {
    if (this.status === promiseStatus.PEDDING) {
      this.status = promiseStatus.REJECTED
      this.reson = value
      this.onRejectedCallbacks.forEach(fn => fn(this.reson))
    }
  }
  catch(onRejectd: PromiseCallback) {
    return this.then(undefined as unknown as PromiseCallback, onRejectd);
  }

}
```
## Promise实例
```typescript
function TestPromise(flag=true){
  return new Mypromise((resolve,reject)=>{
    if(flag){
      resolve('resolve')
    }else{
      reject('reject')
    }
  })
}
let p1 = TestPromise() 
let p2 = TestPromise(false) 
p1.then(res=>{
  console.log(res);
}).catch(err=>{
  console.log(err);
})
p2.then(res=>{
  console.log(res);
}).catch(err=>{
  console.log(err);
})
```

## Promise.all

`Promise.all()` 方法接收一个 `promise` 的 iterable 类型（注：Array，Map，Set 都属于 ES6 的 iterable 类型）的输入，并且只返回一个 `Promise` 实例， 那个输入的所有 `promise` 的 resolve 回调的结果是一个数组。这个 `Promise` 的 resolve 回调执行是在所有输入的 `promise` 的 resolve 回调都结束，或者输入的 iterable 里没有 `promise` 了的时候。它的 `reject` 回调执行是，只要任何一个输入的 `promise` 的 reject 回调执行或者输入不合法的 `promise` 就会立即抛出错误，并且 `reject` 的是第一个抛出的错误信息。

```typescript
Promise.myAll = (promises) => {
  return new Promise((resolve, reject) => {
    let len = promises.length;
    let result = []
    if (len == 0) {
      resolve([])
    }
    promises.forEach((item, index) => {
      Promise.resolve(item).then(res => {
        result[index] = res
        if (index+1 == len) {
          resolve(result)
        }
      }).catch(reject)
    })
  })
}

```

## 案例

```typescript
  let p1 = Promise.resolve(1)
  let p2 = Promise.resolve(2)
  let p3 = Promise.resolve(3)
  let p4 = Promise.reject(4)

  Promise.myAll([p1,p2,p3]).then(res=>{
    console.log(res);
    
  })
  Promise.myAll([p1,p2,p3,p4]).then(res=>{
    console.log(res);
    
  }).catch(err=>{
    console.log(err);
  })
```

## Promise.race

`Promise.race(iterable)` 方法返回一个 `promise` ，一旦迭代器中的某个 `promise` 解决或拒绝，返回的 `promise` 就会解决或拒绝。

## 代码实现

```typescript

Promise.myRace=(promises)=>{
  return new Promise((resolve,reject)=>{
    promise.forEach(item => {
      Promise.resolve(item).then(resolve).catch(reject)
    });
  })
}
```

## 案例

```typescript
  let p1 = Promise.resolve(1)
  let p2 = Promise.resolve(2)
  let p3 = Promise.resolve(3)
  let p4 = Promise.reject(4)

  Promise.myRace([p1,p2,p3]).then(res=>{
    console.log(res);
    
  })
  Promise.myRace([p1,p2,p3,p4]).then(res=>{
    console.log(res);
    
  }).catch(err=>{
    console.log(err);
  })
```

## Promise.any

`Promise.any()` 接收一个`Promise`可迭代对象，只要其中的一个 `promise` 成功，就返回那个已经成功的 `promise` 。如果可迭代对象中没有一个 `promise` 成功（即所有的 `promises` 都失败/拒绝），就返回一个失败的 `promise` 和`AggregateError`类型的实例，它是 `Error` 的一个子类，用于把单一的错误集合在一起。本质上，这个方法和 `Promise.all()` 是相反的。

## 代码实现

```typescript
Promise.MyAny = (promises)=>{
  return new Promise((resolve,reject)=>{
    const len = promises.length;
    const result = []
    const errors = []
    if(len === 0)return reject(new AggregateError('All Promise were rejected'))
    promises.forEach((p,index) => {
      Promise.resolve(p).then(resolve).catch(err=>{
        errors[index]=err
        if(index+1===len){
          reject(errors)
        }
      })
    });
  })
}
```

## 案例
```typescript
  let p1 = Promise.resolve(1)
  let p2 = Promise.resolve(2)
  let p3 = Promise.resolve(3)
  let p4 = Promise.reject(4)

  Promise.MyAny([p1,p2,p3]).then(res=>{
    console.log(res);
    
  })
  Promise.MyAny([p1,p2,p3,p4]).then(res=>{
    console.log(res);
    
  }).catch(err=>{
    console.log(err);
  })
```

## Promise.allSettled

该`Promise.allSettled()`方法返回一个在所有给定的 `promise` 都已经`fulfilled`或`rejected`后的 `promise`，并带有一个对象数组，每个对象表示对应的 `promise` 结果。

当您有多个彼此不依赖的异步任务成功完成时，或者您总是想知道每个`promise`的结果时，通常使用它。

相比之下，`Promise.all()` 更适合彼此相互依赖或者在其中任何一个`reject`时立即结束。

## 代码实现

```typescript
Promise.myAllSettled = (promises) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    let result = []
    const len = promises.length;
    if (len == 0) {
      resolve([])
    }
    promises.forEach((item, index) => {
      Promise.resolve(item).then(res => {
        count += 1
        result[index] = {
          status: 'fulfilled',
          value: res,
        }
        if (len == count) {
          resolve(result)
        }
      }).catch(err => {
        count += 1
        result[index] = {
          status: 'rejected',
          value: err,
        }
        if (len == count) {
          resolve(result)
        }
      })
    })
  })
}
```

## 案例

```typescript
const p1 = Promise.resolve(1)
const p2 = new Promise((resolve) => {
  setTimeout(() => resolve(2), 1000)
})
const p3 = new Promise((resolve) => {
  setTimeout(() => resolve(3), 3000)
})

const p4 = Promise.reject('err4')
const p5 = Promise.reject('err5')
// 1. 所有的Promise都成功了
const p11 = Promise.myAllSettled([p1, p2, p3])
  .then((res) => console.log(JSON.stringify(res, null, 2)))
```
<LastUpdated />



 <!-- <template>
  <Vssue :issue-id="1" />
</template> -->