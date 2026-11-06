<template>
  <div class="about-page">

    <section class="intro">
      <h1>关于</h1>
      <p class="lead">
        我是小何，一名前端工程师。这个站点用来沉淀日常开发中真正踩过的坑、
        验证过的方案，以及那些值得写下来的技术决策。
      </p>
    </section>

    <section class="section">
      <h2>关注方向</h2>
      <el-row :gutter="20">
        <el-col
          v-for="item in focuses"
          :key="item.title"
          :xs="24"
          :sm="12"
          :md="6"
        >
          <el-card shadow="hover" class="focus-card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section class="section">
      <h2>技术栈</h2>
      <el-space wrap>
        <el-tag v-for="tech in stack" :key="tech" size="large">
          {{ tech }}
        </el-tag>
      </el-space>
    </section>

    <section class="section">
      <h2>这个站点</h2>
      <el-card shadow="never" class="site-card">
        <ul>
          <li><strong>内容来源</strong>：全部笔记以 Markdown 存放在仓库，构建时自动读取，没有后台数据库。</li>
          <li><strong>技术选型</strong>：Vue 3 + TypeScript + Vite，UI 用 Element Plus，路由用 Vue Router。</li>
          <li><strong>写作原则</strong>：只写自己验证过的东西，能复现的代码才贴出来。</li>
        </ul>
      </el-card>
    </section>

    <section class="section contact">
      <h2>联系</h2>
      <div class="contact-buttons">
        <el-button type="primary" @click="openGitee">Gitee</el-button>
        <el-button @click="goNotes">看看笔记</el-button>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const focuses = [
  { title: '框架原理', desc: 'Vue 响应式、React Fiber，理解设计背后的取舍。' },
  { title: '性能优化', desc: '渲染链路、核心指标、长任务拆分。' },
  { title: '工程化', desc: '构建、路由、代码分割与部署流程。' },
  { title: 'Node.js', desc: '事件循环、服务端实践与工具链。' },
]

const stack = [
  'Vue 3',
  // 'React 18',
  'TypeScript',
  'Node.js',
  'Vite',
  'Webpack',
  'Git',
]

function openGitee() {
  window.open('https://gitee.com/jx-xh/vue3.app', '_blank')
}

function goNotes() {
  router.push('/notes')
}
</script>

<style scoped>
.about-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.intro h1 {
  font-size: 40px;
  margin: 0 0 16px;
  font-weight: 700;
}

.lead {
  font-size: 18px;
  color: #475569;
  line-height: 1.9;
  margin: 0;
}

.section {
  margin-top: 56px;
}

.section h2 {
  font-size: 26px;
  margin-bottom: 24px;
}

.focus-card {
  height: 160px;
}

.focus-card h3 {
  margin: 0 0 12px;
  font-size: 17px;
}

.focus-card p {
  color: #64748b;
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
}

.site-card ul {
  margin: 0;
  padding-left: 20px;
  line-height: 2;
  color: #475569;
}

.site-card strong {
  color: #0f172a;
}

.contact {
  padding-bottom: 60px;
}

.contact-buttons {
  display: flex;
  gap: 12px;
}
</style>
