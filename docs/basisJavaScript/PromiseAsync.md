# 同步Promise队列

我们可以使用promise得每次在return得时候都会返回一个promise.resolve得特性，让它实现这个功能 很简单,看代码

```ts

    let promise3 = new Promise((resolve)=>{
      setTimeout(() => {
        resolve(3)
      }, 0);
    })
    let promise2 = new Promise((resolve)=>{
      setTimeout(() => {
        resolve(2)
      }, 2000);
    })
    let promise1 = new Promise((resolve)=>{
      setTimeout(() => {
        resolve(1)
      }, 1500);
    })
    class PromiseQueue {
      constructor(){
        this.promiseList = []
      }
      add(promise){
        this.promiseList.push(promise)
        return this
      }
      run(){
        const promiseList =  this.promiseList 
        promiseList.reduce((prev,next)=>{
         return  prev.then(()=>next.then((res)=>console.log(res)))
        },Promise.resolve())
      }
    }
    let queue = new PromiseQueue();
    queue.add(promise1).add(promise2).add(promise3).run()
```