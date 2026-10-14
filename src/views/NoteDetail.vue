<template>
  <div class="detail-page">

    <el-button link class="back" @click="goBack">
      返回笔记列表
    </el-button>

    <article v-if="post" class="article">
      <h1>{{ post.title }}</h1>
      <div class="meta">
        <el-tag size="small">{{ post.tag }}</el-tag>
        <el-tag size="small" type="info">{{ post.category }}</el-tag>
        <time>{{ post.date }}</time>
      </div>

      <div class="markdown-body" v-html="html"></div>
    </article>

    <el-empty v-else description="没有找到这篇笔记">
      <el-button type="primary" @click="goBack">回到列表</el-button>
    </el-empty>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { getPost } from '@/utils/posts'

const route = useRoute()
const router = useRouter()

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
})

const post = computed(() =>
  getPost(route.params.dir as string, route.params.slug as string),
)

const html = computed(() => (post.value ? md.render(post.value.content) : ''))

function goBack() {
  router.push('/notes')
}
</script>

<style scoped>
.detail-page {
  max-width: 820px;
  margin: 0 auto;
  padding: 32px 20px 80px;
}

.back {
  margin-bottom: 20px;
  padding-left: 0;
}

.article h1 {
  font-size: 34px;
  margin: 0 0 16px;
  font-weight: 700;
  line-height: 1.35;
}

.meta {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 8px;
}

.meta time {
  color: #94a3b8;
  font-size: 13px;
}

.markdown-body {
  line-height: 1.85;
  color: #334155;
  font-size: 16px;
}

.markdown-body :deep(h1) {
  font-size: 26px;
  margin: 36px 0 16px;
  font-weight: 600;
  color: #0f172a;
}

.markdown-body :deep(h2) {
  font-size: 22px;
  margin: 32px 0 14px;
  font-weight: 600;
  color: #0f172a;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.markdown-body :deep(h3) {
  font-size: 18px;
  margin: 26px 0 12px;
  font-weight: 600;
  color: #0f172a;
}

.markdown-body :deep(p) {
  margin: 0 0 16px;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 22px;
  margin: 0 0 16px;
}

.markdown-body :deep(li) {
  margin-bottom: 8px;
}

.markdown-body :deep(strong) {
  color: #0f172a;
  font-weight: 600;
}

.markdown-body :deep(code) {
  font-family: ui-monospace, Consolas, monospace;
  font-size: 14px;
  background: #f1f5f9;
  color: #b91c1c;
  padding: 2px 6px;
  border-radius: 4px;
}

.markdown-body :deep(pre) {
  background: #0f172a;
  color: #e2e8f0;
  padding: 18px 20px;
  border-radius: 10px;
  overflow-x: auto;
  margin: 0 0 20px;
  line-height: 1.6;
}

.markdown-body :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
  font-size: 13.5px;
}

.markdown-body :deep(blockquote) {
  margin: 0 0 18px;
  padding: 10px 16px;
  border-left: 3px solid #409eff;
  background: #f8fafc;
  color: #475569;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 20px;
  font-size: 14px;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid #e2e8f0;
  padding: 8px 12px;
  text-align: left;
}

.markdown-body :deep(th) {
  background: #f8fafc;
  font-weight: 600;
}

.markdown-body :deep(a) {
  color: #409eff;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 28px 0;
}
</style>
