---
title: React Hooks 常见陷阱与正确用法
date: 2026-09-30
tag: React
category: React
desc: 闭包陷阱、依赖数组、清理函数——Hooks 最容易出错的几个地方。
---

# React Hooks 常见陷阱与正确用法

## 陷阱一：闭包陷阱（stale closure）

这是 Hooks 最高频的 bug。看这段代码：

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1)   // 永远是 1
    }, 1000)
    return () => clearInterval(timer)
  }, [])   // 依赖为空，effect 只跑一次

  return <div>{count}</div>
}
```

问题在于：`useEffect` 只在挂载时执行了一次，那个闭包里的 `count` 永远是初始值 0，所以每秒都在执行 `setCount(0 + 1)`。

**正确写法**：用函数式更新，绕开对 `count` 的引用。

```jsx
setCount((prev) => prev + 1)
```

`prev` 由 React 传入，永远是当前最新值。

## 陷阱二：依赖数组写不全

```jsx
useEffect(() => {
  fetchUser(userId)   // userId 变了却不会重新请求
}, [])
```

依赖数组里的每一项，都应该是 effect 内部用到的、会变化的外部值。`userId` 参与了逻辑就必须写进去。

但在项目里手写依赖很容易漏，**建议开启 `eslint-plugin-react-hooks` 的 `exhaustive-deps` 规则**，让工具来提醒。

如果某个值确实不想作为依赖（比如只想在挂载时读一次），用 ref 中转：

```jsx
const latestUserId = useRef(userId)
latestUserId.current = userId

useEffect(() => {
  const timer = setInterval(() => {
    console.log(latestUserId.current)   // 总能拿到最新值
  }, 1000)
  return () => clearInterval(timer)
}, [])
```

## 陷阱三：忘记清理副作用

`useEffect` 返回的函数会在组件卸载、以及依赖变化重新执行前调用。不清理会出问题：

```jsx
useEffect(() => {
  const controller = new AbortController()

  fetch('/api/data', { signal: controller.signal })
    .then((res) => res.json())
    .then(setData)
    .catch((err) => {
      if (err.name !== 'AbortError') throw err
    })

  return () => controller.abort()   // 卸载时取消请求
}, [])
```

常见需要清理的：定时器、事件监听、网络请求、WebSocket 连接。

## useMemo 和 useCallback 别滥用

这两个是**缓存**手段，不是性能优化的万能药。它们本身有成本（比较依赖 + 存储），用错反而更慢。

该用的场景：

1. 传给子组件的函数/对象，且子组件用了 `memo` 包裹——避免每次渲染都产生新引用导致重渲染。
2. 计算量确实大的值（比如上万条数据的排序、过滤）。

不该用的场景：简单的 `a + b` 计算、只在本组件内使用的值。

```jsx
// 没必要
const total = useMemo(() => price * count, [price, count])

// 有必要
const sorted = useMemo(() => hugeList.sort(comparator), [hugeList])
```

## 两条铁律

1. **只能在函数组件或自定义 Hook 的顶层调用 Hooks**，不能放在 if、for、嵌套函数里。因为 Hooks 靠**调用顺序**来定位状态，顺序变了就全乱了。
2. **自定义 Hook 必须以 `use` 开头**，否则 ESLint 无法检查里面的 Hooks 调用规则。

## 自定义 Hook 的正确形态

把有状态的逻辑抽出去，返回状态和操作方法：

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved !== null ? JSON.parse(saved) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
```

注意 `useState` 里传的是**函数**（惰性初始化），这样 `JSON.parse` 只在首次渲染执行，不会每次渲染都跑一遍。
