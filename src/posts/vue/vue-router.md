---
title: Vue Router 路由守卫与懒加载
date: 2026-10-08
tag: Vue
category: Vue
desc: 梳理全局守卫、路由独享守卫的执行顺序，以及路由懒加载的正确写法。
---

# Vue Router 路由守卫与懒加载

## 三类守卫

Vue Router 的守卫分三个层级：

1. **全局守卫**：`beforeEach`、`beforeResolve`、`afterEach`
2. **路由独享守卫**：配置里的 `beforeEnter`
3. **组件内守卫**：`beforeRouteEnter`、`beforeRouteUpdate`、`beforeRouteLeave`

一次导航的完整执行顺序：

```
导航触发
  → 失活组件 beforeRouteLeave
  → 全局 beforeEach
  → 复用组件 beforeRouteUpdate
  → 路由配置 beforeEnter
  → 解析异步路由组件
  → 激活组件 beforeRouteEnter
  → 全局 beforeResolve
  → 导航确认
  → 全局 afterEach
  → DOM 更新
  → beforeRouteEnter 的 next 回调
```

记住两点就够用：**`beforeEach` 在组件加载前执行，`afterEach` 没有 next、也不会阻断导航**。

## 登录鉴权的标准写法

```ts
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')

  // 需要登录但未登录 → 跳登录页并带上回跳地址
  if (to.meta.requiresAuth && !token) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  // 已登录还去登录页 → 直接放回首页
  if (to.name === 'Login' && token) {
    return { name: 'Home' }
  }
})
```

Vue Router 4 开始，`next` 参数不再必需——**直接 return 一个路由地址**即可。返回 `false` 表示取消导航，不返回（或返回 `undefined`）表示放行。

这个改动避免了一个经典 bug：在守卫里重复调用 `next()` 导致导航错乱。

## 路由懒加载

不要把组件全部静态 import，那样首屏会把整个应用的代码都拉下来：

```ts
// 不推荐：全部打进主包
import Home from '@/views/Home.vue'

// 推荐：访问到才加载
const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/Home.vue') },
  { path: '/notes', name: 'Notes', component: () => import('@/views/Notes.vue') },
]
```

`() => import(...)` 会被打包器识别为代码分割点，每个路由单独生成一个 chunk。

## 滚动行为

切换路由后页面默认停在原位置，单页应用里体验很割裂。补一条：

```ts
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})
```

`savedPosition` 只在浏览器前进/后退时存在，能还原用户上一次的滚动位置。

## 两个易错点

1. **`path` 和 `name` 别混用**：带 params 的动态路由必须用 `name` 跳转，用 `path` 会忽略 params。
2. **params 刷新丢失**：`/user/:id` 的动态段必须写进 `path`，否则刷新页面参数就没了。
