# 类型操作符

## `keyof`类型操作符
对一个对象类型使用`keyof`操作符,会返回该对象属性名组成的一个**字符串**或者**数字**字面量的联合。这个例子中的类型P就等同于 "x"|"y":

```ts
type Point = {x:number,y:number}

type P = keyof Point
```
但是如果这个类型有一个`string`或者`number`类型的索引签名,keyof则会直接返回这些类型
```ts
这里返回的是key值的
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
// type A = number

type Mapish = { [k: string]: boolean };
type M = keyof Mapish
// type M = string | number 
```
在这个例子中,`M`是`string|number`,这是因为javascript对象中的属性名会被强制转为一个字符串,所以`obj[0]`和`obj["0"]`是一样的.

### 数字字面量联合类型
在一开始我们也说了,`keyof`也可能返回一个**数字字面量**的联合类型,那什么时候返回数字字面量的联合类型呢?看代码
```ts
const NumberIcObject={
  [1]:1,
  [2]:2,
  [3]:3
}
type result = keyof NumberIcObject
//type result = 1|2|3
```
### Symbol
其实TypeScript 也支持symbol类型的属性名
```ts
const sym1 = Symbol();
const sym2 = Symbol();
const sym3 = Symbol();

const symbolToNumberMap = {
  [sym1]: 1,
  [sym2]: 2,
  [sym3]: 3,
};
type Ks = keyof typeof symbolToNumberMap 
// typeof sym1 | typeof sym2 | typeof sym3
```

这也就是为什么当我们在泛型中像下面的例子中使用会报错的原因：

```ts
function useKey<T,K extends keyof T>(o: T, k: K){
  let name:string = k;
  // Type 'string | number | symbol' is not assignable to type 'string'.
}
```

如果你确定只使用字符串类型的属性名，你可以这样写：

```ts
function useKey<T, K extends keyof T>(o: T, k: K) {
  var name: string | number | symbol = k;
}
```

### 类和接口
对类使用`keyof`：

```ts
class Person{
  name:'冴羽'
}

type result = keyof Person;
// type result = 'name';

```

```ts
class Person{
  [1]:string = '冴羽'
}

type result = keyof Person;
// type result = 1;

```
对接口使用`keyof`:

```ts
interface Person:{
  name:string
}

type result = keyof Person
type result = 'name'
```

### 实战
我们希望获取一个对象给定属性名的值，为此，我们需要确保我们不会获取 obj 上不存在的属性。所以我们在两个类型之间建立一个约束：

```ts
function getProperty<Type,Key extends keyof Type>(obj:Type,key:Key) {
  return obj[key];
}
let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m");

// Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
```

## `typeof`类型操作符
JavaScript 本身就有 `typeof` 操作符，你可以在表达式上下文中（expression context）使用：

```ts
// Prints "string"
console.log(typeof "Hello world");
```

而 TypeScript 添加的 `typeof` 方法可以在类型上下文（type context）中使用，用于获取一个变量或者属性的类型。

```ts

let s = "hello";
let n: typeof s;
// let n: string

```

如果仅仅用来判断基本的类型，自然是没什么太大用，和其他的类型操作符搭配使用才能发挥它的作用。

举个例子：比如搭配 TypeScript 内置的 `ReturnType<T>`。你传入一个函数类型，`ReturnType<T>` 会返回该函数的返回值的类型：

```ts
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;
// type K = boolean
```
如果我们直接对一个函数名使用 `ReturnType` ，我们会看到这样一个报错：
```ts
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<f>;

// 'f' refers to a value, but is being used as a type here. Did you mean 'typeof f'?
```

这是因为值`（values）`和类型`（types）`并不是一种东西。为了获取值 `f` 也就是函数 `f` 的类型，我们就需要使用`typeof`：

```ts
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
                    
// type P = {
//    x: number;
//    y: number;
// }

```
### 限制（Limitations）
TypeScript 有意的限制了可以使用 `typeof` 的表达式的种类。

在 TypeScript 中，只有对标识符（比如变量名）或者他们的属性使用 `typeof` 才是合法的。这可能会导致一些令人迷惑的问题：

```ts
// Meant to use = ReturnType<typeof msgbox>
let shouldContinue: typeof msgbox("Are you sure you want to continue?");
// ',' expected.
```
我们本意是想获取 `msgbox("Are you sure you want to continue?")` 的返回值的类型，所以直接使用了 `typeof msgbox("Are you sure you want to continue?")`，看似能正常执行，但实际并不会，这是因为 `typeof` 只能对标识符和属性使用。而正确的写法应该是：

```ts
ReturnType<typeof msgbox>
```

### 对对象使用 `typeof`

```ts
let Obj = {
  name:'x',
  age:12
}
type result = typeof Obj

// type result = {
//   name:string,
//   age:number
// }
```

### 对函数使用 `typeof`

```ts
function identity<Type>(arg:Type):Type
type result = typeof identity

// type result = <Type>identity(arg:Type)=>Type
```

### 对 enum 使用 `typeof`

在 TypeScript 中，enum 是一种新的数据类型，但在具体运行的时候，它会被编译成对象。
```ts
enum UserResponse {
  No = 0,
  Yes = 1,
}

```

对应编译的 JavaScript 代码为：

```ts
var UserResponse;
(function (UserResponse) {
    UserResponse[UserResponse["No"] = 0] = "No";
    UserResponse[UserResponse["Yes"] = 1] = "Yes";
})(UserResponse || (UserResponse = {}));

```

如果我们打印一下 UserResponse：

```ts
console.log(UserResponse);

// [LOG]: {
//   "0": "No",
//   "1": "Yes",
//   "No": 0,
//   "Yes": 1
// } 
```
而如果我们对 UserResponse 使用 typeof：

```TypeScript
type result = typeof UserResponse;

// ok
const a: result = {
      "No": 2,
      "Yes": 3
}

result 类型类似于：

// {
//	"No": number,
//  "YES": number
// }

```

不过对一个 enum 类型只使用 typeof 一般没什么用，通常还会搭配 `keyof` 操作符用于获取属性名的联合字符串：

```ts
type result = keyof typeof UserResponse;
// type result = "No" | "Yes"
```

## in 操作符
`in`操作符用于遍历目标类型的公开属性名。类似 `for .. in` 的机制。

### 使用于枚举类型

我们可以像下面这样使用**枚举类型**：

```TypeScript
type Property = 'name' | 'age' | 'phoneNum';

type PropertyObject = {
  [key in Property]:string 
}
// type PropertyObject = {
//     name: string;
//     age: string;
//     phoneNum: string;
// }
```

## is操作符

`is` 操作符用于TS的类型谓词中，是实现TS类型保护的一种方式

```ts
function doSometing(value: string | number) {
    if (typeof value === 'string') {
        // TS 可以识别这个分支中 value 是 string 类型的参数（这就叫类型保护）
        // do something
    } else {
        // TS 可以识别这个分支中 value 是 number 类型的参数
        // do something
    }
}

```

除去上面这种方式以外，我们可以使用TS的类型谓词来实现：

```ts
/**
 * 此函数用于判断参数 value 是不是 string 类型
 * 
 * 由于返回类型声明了类型谓词，可以帮助TS在代码分支中进行类型保护（默认返回 boolean 类型是没办法做到的）
 **/
function isString(value: any): value is string {
    return typeof value === 'string';
}

function doSometing(value: string | number) {
    if (isString(value)) {
        // TS 可以识别这个分支中 value 是 string 类型的参数（这就叫类型保护）
    } else {
        // TS 可以识别这个分支中 value 是 number 类型的参数
    }
}

```