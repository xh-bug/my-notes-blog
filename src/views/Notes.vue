<template>
  <div class="notes-page">

    <header class="page-head">
      <h1>笔记</h1>
      <span class="count">共 {{ posts.length }} 篇</span>
    </header>

    <div class="filters">
      <button
        class="chip"
        :class="{ active: activeCategory === '' }"
        @click="selectCategory('')"
      >
        全部
      </button>
      <button
        v-for="c in categories"
        :key="c.name"
        class="chip"
        :class="{ active: activeCategory === c.name }"
        @click="selectCategory(c.name)"
      >
        {{ c.name }} · {{ c.count }}
      </button>
    </div>

    <div v-if="list.length" class="list">
      <el-card
        v-for="post in list"
        :key="post.dir + '/' + post.slug"
        shadow="hover"
        class="post-card"
        @click="openPost(post)"
      >
        <div class="post-head">
          <h2>{{ post.title }}</h2>
          <time>{{ post.date }}</time>
        </div>
        <p class="desc">{{ post.desc }}</p>
        <div class="meta">
          <el-tag size="small">{{ post.tag }}</el-tag>
          <el-tag size="small" type="info">{{ post.category }}</el-tag>
          <span class="more">阅读全文</span>
        </div>
      </el-card>
    </div>

    <el-empty v-else description="该分类下还没有笔记" />

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { posts, categories, getPostsByCategory, type PostMeta } from '@/utils/posts'

const route = useRoute()
const router = useRouter()

const activeCategory = ref<string>((route.query.cat as string) || '')

const list = computed(() => getPostsByCategory(activeCategory.value))

function selectCategory(name: string) {
  activeCategory.value = name
  router.replace({ path: '/notes', query: name ? { cat: name } : {} })
}

function openPost(post: PostMeta) {
  router.push(`/notes/${post.dir}/${post.slug}`)
}
</script>

<style scoped>
.notes-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px 80px;
}

.page-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
}

.page-head h1 {
  font-size: 38px;
  margin: 0;
  font-weight: 700;
}

.count {
  color: #94a3b8;
  font-size: 14px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.chip {
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.chip:hover {
  border-color: #94a3b8;
}

.chip.active {
  border-color: #409eff;
  background: #ecf5ff;
  color: #409eff;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.post-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.post-card:hover {
  transform: translateY(-2px);
}

.post-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.post-head h2 {
  font-size: 19px;
  margin: 0;
  font-weight: 600;
}

.post-head time {
  color: #94a3b8;
  font-size: 13px;
  white-space: nowrap;
}

.desc {
  color: #64748b;
  font-size: 14px;
  line-height: 1.7;
  margin: 10px 0 14px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.more {
  margin-left: auto;
  font-size: 13px;
  color: #409eff;
}
</style>
