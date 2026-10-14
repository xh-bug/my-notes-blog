---
title: React Fiber 架构解析
date: 2026-10-05
tag: React
category: React
desc: 理解 React 为什么需要 Fiber，以及可中断渲染是怎么实现的。
---

# React Fiber 架构解析

## 旧架构的问题

React 15 的 reconciliation（diff）是**递归遍历组件树**的，一旦开始就无法中断。如果组件树很深（几百个节点），一次更新会占用主线程几十甚至上百毫秒，期间浏览器无法响应点击、输入和动画——这就是卡顿的来源。

根本原因是：递归调用栈没法暂停，也无法恢复。

## Fiber 是什么

Fiber 是对这套机制的重写，核心思路两点：

1. **把递归改成链表遍历**——每个 Fiber 节点有 `child`、`sibling`、`return` 三个指针，构成一棵可手动控制的链表树，随时能中断、能从断点继续。
2. **把渲染拆成两个阶段**，中间可以插入高优先级任务。

一个 Fiber 节点大致长这样：

```js
{
  type: 'div',           // 组件类型或 DOM 标签
  key: null,
  stateNode: domNode,    // 对应的真实 DOM
  child: fiber,          // 第一个子节点
  sibling: fiber,        // 下一个兄弟节点
  return: fiber,         // 父节点
  pendingProps: {},      // 新 props
  memoizedProps: {},     // 上一次的 props
  alternate: oldFiber,   // 指向上一次的 Fiber，用于 diff
  flags: 'Placement',    // 需要执行的副作用
}
```

注意 `alternate`——这就是**双缓冲**：屏幕上显示的叫 current tree，正在内存里构建的叫 workInProgress tree，两棵树通过 `alternate` 互相指向。更新完成后直接切换指针，避免重建整棵树。

## 两个阶段

### render 阶段（可中断）

从根节点开始遍历，做 diff、打 effect 标记。这个阶段**可以被打断**：

- 有更高优先级的更新（比如用户输入）进来，先让给它
- 时间片用完（默认 5ms），让出主线程

因为是链表遍历，中断时只要记住当前处理到哪个节点，之后从那儿继续即可。

### commit 阶段（不可中断）

把 render 阶段算出的变更一次性提交到 DOM。必须一气呵成，否则会出现半截渲染的界面。

```
render 阶段（可中断）        commit 阶段（同步）
beginWork → completeWork  →  beforeMutation
                             mutation   → 更新 DOM
                             layout     → 调用 useLayoutEffect
```

## 时间切片怎么做的

React 用 `MessageChannel` 而非 `setTimeout` 来调度：

```js
const channel = new MessageChannel()
channel.port1.onmessage = performWorkUntilDeadline

function scheduleCallback(callback) {
  channel.port2.postMessage(null)
}
```

选 `MessageChannel` 的原因是：`setTimeout` 即使设 0ms 也有最小 4ms 的延迟，而 MessageChannel 是宏任务里最接近"立即执行"的，不受最小延迟限制。

每个工作循环开始时会检查剩余时间：

```js
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}
```

`shouldYield()` 判断当前时间片（5ms）是否用完，用完就退出循环，把控制权还给浏览器。

## Concurrent 带来的能力

有了可中断渲染，才有了这些 API：

- **`useTransition`**：把某个更新标记为"可打断的低优先级"。比如搜索框输入时，输入本身是高优先级，过滤列表是低优先级。
- **`Suspense`**：渲染到一半发现数据没来，可以暂停这个子树，先展示 fallback，数据到了再继续。
- **`useDeferredValue`**：延迟某个值的更新，保持界面响应。

## 实践意义

理解 Fiber 后，有几点直接影响写法：

1. **render 阶段会被重复执行**，所以组件函数体里不能写副作用（发请求、改 DOM），那类操作必须放进 `useEffect`。
2. **别在渲染里做重计算**，它可能被打断后重跑，用 `useMemo` 缓存。
3. 遇到卡顿，先用 React DevTools 的 Profiler 定位是哪个组件 render 太慢，再考虑 `memo` 或拆组件——**Fiber 解决的是调度问题，不是计算量问题**。
