---
title: Vue3 响应式原理深入分析
date: 2026-10-14
tag: Vue
category: Vue
desc: 从 Proxy 到 effect，理解 Vue3 响应式系统的实现。
---

# Vue3 响应式原理深入分析

## 为什么从 defineProperty 换成 Proxy

Vue2 用 `Object.defineProperty` 递归劫持每个属性，有三个绕不开的短板：

1. **监听不到属性的新增与删除**，必须靠 `Vue.set` / `Vue.delete` 兜底。
2. **监听不到数组索引赋值和 length 变化**，只能重写 7 个数组方法（`push`、`splice` 等）来变相实现。
3. **初始化就要递归遍历整个对象**，对象层级一深，首屏初始化开销明显。

Vue3 改用 `Proxy` 代理整个对象，这三个问题一次性解决：增删属性可拦截、数组索引可拦截，而且是**懒代理**——只有真正访问到某个嵌套对象时才为它创建代理。

## reactive 的最小实现

响应式系统的核心就两个动作：**读取时收集依赖（track），修改时触发更新（trigger）**。

```ts
const targetMap = new WeakMap()
let activeEffect: Function | null = null

function track(target: object, key: string | symbol) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))
  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set()))
  dep.add(activeEffect)
}

function trigger(target: object, key: string | symbol) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const dep = depsMap.get(key)
  if (dep) dep.forEach((effect) => effect())
}

function reactive<T extends object>(target: T): T {
  return new Proxy(target, {
    get(obj, key, receiver) {
      track(obj, key)
      const res = Reflect.get(obj, key, receiver)
      // 懒代理：访问到嵌套对象时才递归
      return typeof res === 'object' && res !== null ? reactive(res) : res
    },
    set(obj, key, value, receiver) {
      const ok = Reflect.set(obj, key, value, receiver)
      trigger(obj, key)
      return ok
    },
    deleteProperty(obj, key) {
      const ok = Reflect.deleteProperty(obj, key)
      trigger(obj, key)
      return ok
    },
  })
}
```

关键在于 `Reflect.get/set` 必须带上 `receiver`，否则当对象存在原型链时，`this` 指向会出错，导致依赖收集到错误的 target 上。

## effect 是怎么串起来的

```ts
function effect(fn: Function) {
  const run = () => {
    activeEffect = run
    try {
      return fn()
    } finally {
      activeEffect = null
    }
  }
  run()
}
```

执行 `effect(fn)` 时把自身挂到 `activeEffect`，然后**立即跑一次 fn**。fn 内部访问响应式对象会触发 `get` → `track`，于是这个 effect 被存进对应属性的依赖集合。之后属性变化触发 `trigger`，effect 重新执行。

这就是 Vue3 不需要显式 `watch` 也能自动更新的原因——模板编译后本质上就是一个 effect。

## ref 为什么需要 .value

`Proxy` 只能代理对象，基础类型（string、number）无法被代理。所以 Vue3 用一层对象壳包起来：

```ts
function ref(value: any) {
  return reactive({ value })
}
```

访问 `count.value` 时触发 `get`，就能正常收集依赖了。这也是为什么在 `<script setup>` 里 ref 必须写 `.value`，而在模板里 Vue 会自动解包。

## 与 Vue2 的对比

| 维度 | Vue2 defineProperty | Vue3 Proxy |
| --- | --- | --- |
| 新增属性 | 需 Vue.set | 直接支持 |
| 数组索引 | 需重写方法 | 直接支持 |
| 初始化开销 | 全量递归 | 懒代理，按需 |
| 数据结构 | — | 需 WeakMap，内存占用略高 |

## 实践里的两个坑

1. **解构会丢失响应式**：`const { count } = reactive(obj)` 拿到的 `count` 是普通值，不再是响应式的。要解构请用 `toRefs`。
2. **reactive 不能整体替换**：`obj = reactive(newObj)` 会让原引用失效，应改用 `Object.assign(obj, newObj)` 或直接上 `ref`。
