---
title: 浏览器渲染性能优化实践
date: 2026-10-10
tag: Performance
category: 性能优化
desc: 从关键渲染路径、重排重绘到核心性能指标，梳理前端能落地的优化动作。
---

# 浏览器渲染性能优化实践

## 关键渲染路径

浏览器从拿到 HTML 到画出像素，要走过这几步：

```
HTML → DOM 树
CSS  → CSSOM 树
DOM + CSSOM → Render Tree（渲染树）
Render Tree → Layout（布局，算出位置和尺寸）
Layout → Paint（绘制，填色、描边）
Paint → Composite（合成，图层合并上屏）
```

优化的本质就是：**尽量缩短这条链路，或者让它少跑几遍**。

## 重排与重绘

- **重排（Reflow / Layout）**：几何属性变了（宽高、位置、字体大小），浏览器要重新计算布局。代价最高。
- **重绘（Repaint）**：只是外观变了（颜色、背景），不用重新算位置。代价次之。
- **合成（Composite）**：只改 `transform`、`opacity`，可以跳过布局和绘制，直接交给 GPU。代价最低。

所以动画优先用 `transform` 和 `opacity`，别动 `top`、`left`、`width`。

```css
/* 慢：触发重排 */
.box { transition: left 0.3s; }

/* 快：只触发合成 */
.box { transition: transform 0.3s; }
```

## 布局抖动（Layout Thrashing）

这是最常见的性能杀手：在循环里**交替读写**布局属性，迫使浏览器反复重排。

```js
// 错误：每次读 offsetHeight 都强制刷新布局
items.forEach((item) => {
  item.style.height = item.offsetHeight + 10 + 'px'
})

// 正确：先批量读，再批量写
const heights = items.map((item) => item.offsetHeight)
items.forEach((item, i) => {
  item.style.height = heights[i] + 10 + 'px'
})
```

浏览器本来会攒一批 DOM 变更再统一处理，但一旦你读取布局属性，它就必须立即计算——这个"强制同步布局"在循环里会被放大成百上千次。

## 资源加载优化

1. **CSS 放头部**：CSS 会阻塞渲染，早点下载完早点构建 CSSOM。
2. **JS 放底部或加 `defer`**：脚本默认会阻塞 HTML 解析（因为可能调用 `document.write`）。`defer` 让它在 DOM 解析完再执行，`async` 则是下载完立即执行。
3. **关键 CSS 内联**：首屏用到的样式直接内联进 `<style>`，省掉一次网络往返。
4. **图片懒加载**：`<img loading="lazy">`，首屏之外的图片等滚动到再加载。

```html
<link rel="stylesheet" href="/main.css">
<script src="/app.js" defer></script>
<img src="/hero.webp" alt="">
<img src="/below-fold.webp" loading="lazy" alt="">
```

## 三个核心指标（Core Web Vitals）

| 指标 | 含义 | 良好阈值 |
| --- | --- | --- |
| **LCP** | 最大内容绘制，首屏主要内容出现的时间 | < 2.5s |
| **INP** | 交互到下一次绘制的延迟，取代了旧的 FID | < 200ms |
| **CLS** | 累积布局偏移，页面元素意外跳动的程度 | < 0.1 |

**CLS 最常见的成因**是图片没设尺寸，加载完成后把下面的内容顶下去。解法很简单：

```html
<img src="/a.jpg" width="800" height="600" alt="">
```

或者用 CSS 预留空间：

```css
.img-wrap { aspect-ratio: 4 / 3; }
```

## 长任务的拆分

主线程上超过 50ms 的任务叫**长任务**，会让页面失去响应。处理方式：

```js
// 把大循环切片，每片之后让出主线程
async function processBigList(list) {
  for (let i = 0; i < list.length; i++) {
    handle(list[i])
    if (i % 100 === 0) {
      await new Promise((r) => setTimeout(r, 0))   // 让出主线程
    }
  }
}
```

更现代的做法是 `scheduler.yield()`（Chrome 支持），语义更明确。

## 排查工具

1. **Lighthouse**：一键拿到性能评分和 Core Web Vitals，看整体。
2. **DevTools Performance 面板**：录制后看火焰图，定位是哪段脚本或哪次重排耗时。
3. **PerformanceObserver**：在生产环境埋点，采集真实用户数据。

```js
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 50) {
      reportLongTask(entry)   // 上报长任务
    }
  }
}).observe({ entryTypes: ['longtask'] })
```

实验室数据（Lighthouse）和真实用户数据（RUM）会有差距，**优化效果最终以线上指标为准**。
