export interface PostMeta {
  dir: string // 目录名，用于路由：vue / react / node / perf
  slug: string // 文件名，用于路由
  title: string
  date: string
  tag: string
  category: string // 展示用分类名：Vue / React / Node.js / 性能优化
  desc: string
  content: string
}

const modules = import.meta.glob('../posts/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function splitFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const data: Record<string, string> = {}

  if (!match) return { data, content: raw }

  match[1].split(/\r?\n/).forEach((line) => {
    const idx = line.indexOf(':')
    if (idx > 0) {
      data[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
    }
  })

  return { data, content: match[2] }
}

export const posts: PostMeta[] = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, content } = splitFrontmatter(raw)
    const segments = path
      .replace(/^.*\/posts\//, '')
      .replace(/\.md$/, '')
      .split('/')
    const slug = segments.pop() || ''
    const dir = segments.join('/') || 'other'

    return {
      dir,
      slug,
      title: data.title || slug,
      date: data.date || '',
      tag: data.tag || '未分类',
      category: data.category || '未分类',
      desc: data.desc || '',
      content,
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export interface CategoryStat {
  name: string
  count: number
}

export const categories: CategoryStat[] = (() => {
  const map = new Map<string, number>()
  posts.forEach((p) => map.set(p.category, (map.get(p.category) || 0) + 1))
  return Array.from(map, ([name, count]) => ({ name, count }))
})()

export function getPost(dir: string, slug: string): PostMeta | undefined {
  return posts.find((p) => p.dir === dir && p.slug === slug)
}

export function getPostsByCategory(category: string): PostMeta[] {
  if (!category) return posts
  return posts.filter((p) => p.category === category)
}
