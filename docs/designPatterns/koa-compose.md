# Koa-Compose

简单写写洋葱模型的核心代码

```js
interface Ctx {
  headers: string,
  prot: number
}
interface CallBack {
  (ctx: Ctx, next: Function): void
}

class KoaNext {
  middleware: CallBack[]
  ctx: Ctx
  constructor() {
    this.middleware = []
    this.ctx = {
      headers: '200',
      prot: 3000
    }
  }
  use(fn) {
    this.middleware.push(fn)
    return this
  }
  compose() {
  
    const dispatch =function (this,index: number)  {
      if (index === this.middleware.length) return Promise.resolve();
      const route = this.middleware[index];
      if (!route) return Promise.resolve()
      return Promise.resolve(route(this.ctx, () => dispatch.call(this,(index + 1))));
    }
    dispatch.call(this,0);
  }
  listen(callBack:any) {
    callBack()
    this.compose.call(this)
  }
}

let koa = new KoaNext()
let mw1 = async function (ctx, next) {
  console.log(ctx);
  console.log("next前,第一个中间件")
  await next()
  console.log("next后,第一个中间件")
}
let mw2 = async function (ctx, next) {
  console.log("next前,第二个中间件")
  await next()
  console.log("next后,第二个中间件")
}
let mw3 = async function (ctx, next) {
  console.log("第三个中间件,没有next了")
}
koa.use(mw1).use(mw2).use(mw3).listen(() => {
  console.log("open http");
})


```