---
title: Node.js 事件循环机制
date: 2026-09-28
tag: Node.js
category: Node.js
desc: 宏任务、微任务与事件循环六个阶段的执行顺序，以及和浏览器的差异。
---

# Node.js 事件循环机制

## 一句话概括

事件循环就是 Node.js 用来**处理非阻塞 I/O 的机制**——把耗时操作交给系统内核，完成后再把回调放回队列依次执行。

## 六个阶段

一次循环（tick）按顺序经过六个阶段，每个阶段都有自己的回调队列：

```
   ┌───────────────────────────┐
┌─>│        timers             │  setTimeout / setInterval 到期回调
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  上一轮未完成的 I/O 回调
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  内部使用
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  执行 I/O 回调，可能在这里阻塞等待
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  setImmediate 回调
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │  socket.on('close') 等
   └───────────────────────────┘
```

重点记住三个：**timers**（定时器）、**poll**（I/O 回调）、**check**（setImmediate）。

## 微任务插在哪里

每个阶段之间，都会清空微任务队列。Node.js 的微任务有两类，优先级不同：

1. **`process.nextTick`** —— 优先级最高，比 Promise 还快
2. **Promise.then / queueMicrotask / async await**

顺序是：`process.nextTick` → Promise 微任务 → 进入下一阶段。

## 经典面试题的输出顺序

```js
console.log('1')

setTimeout(() => console.log('2'), 0)
setImmediate(() => console.log('3'))
process.nextTick(() => console.log('4'))
Promise.resolve().then(() => console.log('5'))

console.log('6')
```

输出：`1 6 4 5 2 3`

逐条解释：

- `1`、`6` 是同步代码，最先执行。
- `4` 是 `nextTick`，微任务里优先级最高。
- `5` 是 Promise 微任务，次之。
- `2` 是 `setTimeout`，属于 timers 阶段。
- `3` 是 `setImmediate`，属于 check 阶段，在 timers 之后。

## setTimeout 和 setImmediate 谁先

**在主模块里，顺序是不确定的**。因为 `setTimeout(fn, 0)` 实际会被改成 1ms，而事件循环启动本身也要耗时——如果启动时 1ms 还没到，timers 队列是空的，就会先跑到 check 阶段执行 `setImmediate`；反之则 `setTimeout` 先。

但在 **I/O 回调内部**，顺序是确定的：`setImmediate` 永远先于 `setTimeout`。因为 I/O 回调在 poll 阶段执行，接下来一定是 check，然后才绕回 timers。

```js
const fs = require('fs')
fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0)
  setImmediate(() => console.log('immediate'))
})
// 永远输出：immediate → timeout
```

## 和浏览器的差异

| 维度 | 浏览器 | Node.js |
| --- | --- | --- |
| 微任务 | Promise、MutationObserver | process.nextTick、Promise |
| 宏任务阶段 | 单一任务队列 | 六个阶段 |
| setImmediate | 无 | check 阶段 |

浏览器没有阶段划分，每次只取一个宏任务执行，然后清空微任务。Node 则要按阶段走完一圈。

## 实践注意

1. **别在 `poll` 阶段做 CPU 密集计算**，会阻塞整个循环。重计算请丢给 `worker_threads` 或拆成小片。
2. **`process.nextTick` 不要递归调用**，否则微任务队列永远清空不完，I/O 就饿死了。
3. `setImmediate` 适合"当前阶段结束后立刻执行"，比 `setTimeout(fn, 0)` 语义更准。
