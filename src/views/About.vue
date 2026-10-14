<template>
  <div class="about-page">

    <!-- ① Hero 个人区 -->
    <section class="hero">
      <div class="hero-inner">
        <div class="avatar-wrap">
          <el-avatar
            :size="112"
            class="avatar"
            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          />
          <div class="avatar-ring"></div>
        </div>
        <div class="hero-info">
          <h1>你好，我是小何 <span class="wave">👋</span></h1>
          <p class="role">前端工程师 · 喜欢折腾代码、记录笔记</p>
          <p class="bio">
            这个站点用来沉淀日常开发中真正踩过的坑、验证过的方案，
            以及那些值得写下来的技术决策。希望对你也有用。
          </p>
          <div class="hero-tags">
            <el-tag type="primary" effect="plain">Vue 3</el-tag>
            <!-- <el-tag type="success" effect="plain">React</el-tag> -->
            <el-tag type="warning" effect="plain">TypeScript</el-tag>
            <el-tag type="info" effect="plain">Node.js</el-tag>
          </div>
        </div>
      </div>
    </section>

    <!-- ② 关于我 · 基础信息 -->
    <section class="section">
      <div class="section-head">
        <h2>关于我</h2>
        <span class="section-sub">一些基础信息</span>
      </div>
      <el-card shadow="never" class="info-card">
        <el-row :gutter="24">
          <el-col
            v-for="item in baseInfo"
            :key="item.label"
            :xs="12"
            :sm="12"
            :md="6"
          >
            <div
              class="info-item"
              :class="{ 'info-clickable': item.copyable }"
              @click="copyValue(item)"
            >
              <el-icon class="info-icon" :size="22">
                <component :is="item.icon" />
              </el-icon>
              <div>
                <div class="info-label">{{ item.label }}</div>
                <div class="info-value">{{ item.value }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </section>

    <!-- ③ 关注方向 -->
    <section class="section">
      <div class="section-head">
        <h2>关注方向</h2>
        <span class="section-sub">最近花时间最多的几个领域</span>
      </div>
      <el-row :gutter="20">
        <el-col
          v-for="item in focuses"
          :key="item.title"
          :xs="24"
          :sm="12"
          :md="6"
        >
          <el-card shadow="hover" class="focus-card">
            <div class="focus-icon" :style="{ background: item.bg }">
              <el-icon :size="22"><component :is="item.icon" /></el-icon>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- ④ 技术栈 -->
    <section class="section">
      <div class="section-head">
        <h2>技术栈</h2>
        <span class="section-sub">日常使用的工具与语言</span>
      </div>
      <el-card shadow="never" class="stack-card">
        <div v-for="group in stackGroups" :key="group.name" class="stack-group">
          <div class="stack-name">{{ group.name }}</div>
          <el-space wrap>
            <el-tag
              v-for="tech in group.items"
              :key="tech"
              size="large"
              :type="group.type"
              effect="light"
              round
              class="stack-tag"
            >
              {{ tech }}
            </el-tag>
          </el-space>
        </div>
      </el-card>
    </section>

    <!-- ⑤ 工作经历 -->
    <section class="section">
      <div class="section-head">
        <h2>工作经历</h2>
        <span class="section-sub">从校园到职场的几个阶段</span>
      </div>
      <el-card shadow="never" class="timeline-card">
        <el-timeline>
          <el-timeline-item
            v-for="item in experiences"
            :key="item.time"
            :timestamp="item.time"
            :type="item.type"
            :hollow="item.hollow"
            size="large"
          >
            <h4 class="exp-title">{{ item.title }}</h4>
            <p class="exp-company">{{ item.company }}</p>
            <p class="exp-desc">{{ item.desc }}</p>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </section>

    <!-- ⑥ 项目经验 -->
    <section class="section">
      <div class="section-head">
        <h2>项目经验</h2>
        <span class="section-sub">做过的一些有代表性的项目</span>
      </div>
      <el-row :gutter="20">
        <el-col
          v-for="proj in projects"
          :key="proj.name"
          :xs="24"
          :md="12"
        >
          <el-card shadow="hover" class="project-card">
            <div class="project-header">
              <h3>{{ proj.name }}</h3>
              <el-tag size="small" :type="proj.tagType">{{ proj.role }}</el-tag>
            </div>
            <p class="project-desc">{{ proj.desc }}</p>
            <el-divider class="project-divider" />
            <div class="project-tech">
              <el-tag
                v-for="t in proj.tech"
                :key="t"
                size="small"
                type="info"
                effect="plain"
              >
                {{ t }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- ⑦ 站点数据 -->
    <section class="section">
      <div class="section-head">
        <h2>站点数据</h2>
        <span class="section-sub">持续更新中</span>
      </div>
      <el-row :gutter="20">
        <el-col v-for="s in siteStats" :key="s.label" :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-icon" :style="{ background: s.color }">
              <el-icon :size="20"><component :is="s.icon" /></el-icon>
            </div>
            <div class="stat-body">
              <div class="stat-value">
                <span>{{ s.prefix }}</span>
                <span>{{ s.value }}</span>
                <span class="stat-unit">{{ s.unit }}</span>
              </div>
              <div class="stat-label">{{ s.label }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- ⑧ 这个站点 -->
    <section class="section">
      <div class="section-head">
        <h2>这个站点</h2>
        <span class="section-sub">关于本站本身</span>
      </div>
      <el-card shadow="never" class="site-card">
        <ul>
          <li><strong>内容来源</strong>：全部笔记以 Markdown 存放在仓库，构建时自动读取，没有后台数据库。</li>
          <li><strong>技术选型</strong>：Vue 3 + TypeScript + Vite，UI 用 Element Plus，路由用 Vue Router。</li>
          <li><strong>写作原则</strong>：只写自己验证过的东西，能复现的代码才贴出来。</li>
          <li><strong>更新节奏</strong>：工作日有空就写，争取每周至少一篇。</li>
        </ul>
      </el-card>
    </section>

    <!-- ⑨ 工作之外 -->
    <section class="section">
      <div class="section-head">
        <h2>工作之外</h2>
        <span class="section-sub">代码之外我是谁</span>
      </div>
      <el-row :gutter="20">
        <el-col v-for="h in hobbies" :key="h.title" :xs="12" :sm="6">
          <el-card shadow="hover" class="hobby-card">
            <div class="hobby-icon" :style="{ background: h.bg }">
              <el-icon :size="24"><component :is="h.icon" /></el-icon>
            </div>
            <h4>{{ h.title }}</h4>
            <p>{{ h.desc }}</p>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- ⑩ 联系方式 -->
    <section class="section contact">
      <div class="section-head">
        <h2>联系我</h2>
        <span class="section-sub">技术交流 · 笔记勘误 · 推荐话题，都欢迎</span>
      </div>
      <el-row :gutter="16">
        <el-col
          v-for="c in contacts"
          :key="c.key"
          :xs="12"
          :sm="8"
          :md="8"
        >
          <el-card
            shadow="hover"
            class="contact-card"
            :class="`contact-${c.key}`"
            @click="handleContact(c)"
          >
            <div class="contact-inner">
              <div class="contact-icon" :style="{ background: c.bg }">
                <el-icon :size="22"><component :is="c.icon" /></el-icon>
              </div>
              <div class="contact-body">
                <div class="contact-label">{{ c.label }}</div>
                <div class="contact-value">{{ c.display }}</div>
              </div>
              <el-icon class="contact-arrow"><ArrowRight /></el-icon>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 微信二维码弹窗 -->
    <el-dialog
      v-model="wechatVisible"
      title="微信扫一扫"
      width="320px"
      center
      align-center
    >
      <div class="qrcode-wrap">
        <img
          class="qrcode-img"
          src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=weixin://yourname"
          alt="微信二维码"
        />
        <p class="qrcode-tip">添加时备注「笔记网站」，谢谢 🙏</p>
      </div>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Location,
  Briefcase,
  Message,
  Aim,
  TrendCharts,
  Lightning,
  SetUp,
  Platform,
  Reading,
  Bicycle,
  Camera,
  VideoPlay,
  ChatDotRound,
  ChatLineRound,
  Edit,
  ArrowRight,
  Document,
  Star,
  Sunny,
  Trophy,
} from '@element-plus/icons-vue'

const router = useRouter()
const wechatVisible = ref(false)

// 基础信息
const baseInfo = [
  { icon: Location,    label: '所在地', value: '广东',        copyable: false },
  { icon: Briefcase,   label: '状态',   value: '离职· 欢迎交流', copyable: false },
  { icon: Message,     label: '邮箱',   value: 'xh_bug@126.com', copyable: true },
  { icon: Aim,         label: '方向',   value: '前端工程化',     copyable: false },
]

// 关注方向
const focuses = [
  {
    title: '框架原理',
    desc: 'Vue 响应式、React Fiber，理解设计背后的取舍。',
    icon: TrendCharts,
    bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    title: '性能优化',
    desc: '渲染链路、核心指标、长任务拆分与监控。',
    icon: Lightning,
    bg: 'linear-gradient(135deg, #f59e0b, #f43f5e)',
  },
  {
    title: '工程化',
    desc: '构建、路由、代码分割、CI/CD 与部署流程。',
    icon: SetUp,
    bg: 'linear-gradient(135deg, #10b981, #06b6d4)',
  },
  {
    title: 'Node.js',
    desc: '事件循环、服务端实践与工具链编写。',
    icon: Platform,
    bg: 'linear-gradient(135deg, #22c55e, #84cc16)',
  },
]

// 技术栈（分组）
const stackGroups = [
  {
    name: '前端框架',
    type: 'primary' as const,
    items: ['Vue 3', 'React 18', 'Next.js', 'Pinia', 'Vuex'],
  },
  {
    name: '构建工具',
    type: 'success' as const,
    items: ['Vite', 'Webpack', 'Rollup', 'esbuild'],
  },
  {
    name: '语言与工具',
    type: 'warning' as const,
    items: ['TypeScript', 'JavaScript', 'SCSS', 'Git', 'Linux'],
  },
  
  {
    name: '学习中',
    type: 'info' as const,
    items: ['Python', 'Three.js', 'Tailwind CSS'],
  },
]

// 工作经历
const experiences = [
  {
    time: '2024 - 2026',
    title: '前端工程师',
    company: '江西科晨洪兴科技有限公司',
    desc: '负责电力行业PC端后台管理系统，主导与大型业务系统重构改造，推动多个核心模块重构。',
    type: 'primary' as const,
    hollow: false,
  },
  {
    time: '2023 - 2024',
    title: '前端开发工程师',
    company: '柯莱特信息技术有限公司',
    desc: '驻国网青海电力研发团队，负责智慧供应链、电力门户、评标平台等多个电力子项目前端开发与优化工作。',
    type: 'success' as const,
    hollow: false,
  },

]

// 项目经验
const projects = [
  {
    name: '省级库房智能仓储',
    role: '负责人',
    tagType: 'danger' as const,
    desc: '借用归还、报废处置、试验检测、库存盘点、资产台账、库存管理、数据统计分析等多个核心业务模块',
    tech: ["Vue2" +" Vue- Router" + "Vuex" + "Axios" + "ECharts" + "Element- UI"],
  },
    {
    name: '电力 e 链门户网',
    role: '负责人',
    tagType: 'primary' as const,
    desc: '供应链信息公开等核心业务全国入驻供应商提供招投标公告展示、业务办理、信息查询、供应商服务等一体化线上服务，支撑电力物资采购、招标交易、供应链信息公开等核心业务',
    tech: ["Vue2", "vuex", "vue- router", "Element-UI" ,"axios"],
  },
  {
    name: 'i 国网（江西电力业务子应用）',
    role: '核心开发',
    tagType: 'warning' as const,
    desc: '电力系统各级专业仓库。主要覆盖物资借用、归还、报废处置、试验检测、库存盘点全流程仓储业务',
    tech: ["Vue2" + "Vue- Router" + "Vuex" + "Axios" + "Vant"],
  },
  {
    name: '青海电力智慧供应链',
    role: '核心开发',
    tagType: 'success' as const,
    desc: '聚焦电力物资数字化转型，涵盖计划管理、采购管理、招标管理、合同管理、物流管理、全景质控等核心业务',
    tech: ["Vue2", "Vue-Router", "Vuex", "Echars" , "Umy-ui", "El-ement -ui", "V-distpicker"],
  },

]

// 站点数据（占位，你后续接入真实数据）
const siteStats = [
  { label: '累计笔记',   value: '36',   prefix: '',  unit: '篇', icon: Document, color: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { label: '分类标签',   value: '12',   prefix: '',  unit: '个', icon: Star,     color: 'linear-gradient(135deg, #f59e0b, #f43f5e)' },
  { label: '累计字数',   value: '8.6',  prefix: '',  unit: 'w', icon: Reading,  color: 'linear-gradient(135deg, #10b981, #06b6d4)' },
  { label: '已运行',     value: '120',  prefix: '',  unit: '天', icon: Sunny,    color: 'linear-gradient(135deg, #0ea5e9, #22d3ee)' },
]

// 兴趣爱好
const hobbies = [

  { title: '游泳',   desc: '一周两次 5 公里，配速 6\'30"，解压首选。',     icon: Bicycle,   bg: 'linear-gradient(135deg, #f59e0b, #f43f5e)' },
{ title: '打游戏', desc: '主机 + PC 党，主玩动作和 RPG。',              icon: VideoPlay, bg: 'linear-gradient(135deg, #0ea5e9, #22d3ee)' },
{ title: '看论坛', desc: 'V2EX、NodeSeek 日常摸鱼潜水。',              icon: Camera,     bg: 'linear-gradient(135deg, #14b8a6, #84cc16)' },
{ title: '刷剧',   desc: '睡前刷一集，主追悬疑和科幻。',                icon: VideoPlay,        bg: 'linear-gradient(135deg, #ec4899, #f97316)' },
]

// 联系方式
const contacts = [
  { key: 'wechat', label: '微信',   icon: ChatDotRound,    bg: 'linear-gradient(135deg, #22c55e, #16a34a)', value: 'xh_bug',      display: 'xh_bug',        action: 'qrcode' as const },
  { key: 'qq',     label: 'QQ',     icon: ChatLineRound,   bg: 'linear-gradient(135deg, #0ea5e9, #2563eb)', value: '415040438',        display: '415040438',          action: 'copy' as const },
  { key: 'email',  label: '邮箱',   icon: Message,         bg: 'linear-gradient(135deg, #f59e0b, #f43f5e)', value: 'xh_bug@126.com', display: 'xh_bug@126.com', action: 'copy' as const },
  { key: 'github', label: 'GitHub', icon: Platform,        bg: 'linear-gradient(135deg, #334155, #0f172a)', value: 'https://github.com/xh_bug',       display: 'https://github.com/xh_bug', action: 'link' as const },
  { key: 'gitee',  label: 'Gitee',  icon: Platform,        bg: 'linear-gradient(135deg, #c2410c, #ea580c)', value: 'https://gitee.com/jx-xh',  display: 'gitee.com/jx-xh',     action: 'link' as const },
  // { key: 'juejin', label: '掘金',   icon: Edit,            bg: 'linear-gradient(135deg, #1e40af, #3b82f6)', value: 'https://juejin.cn/user/yourname',    display: 'juejin.cn/yourname',  action: 'link' as const },
]

function copyValue(item: { value: string }) {
  copyText(item.value, item.value)
}

function copyText(text: string, label: string) {
  if (!navigator?.clipboard) {
    ElMessage.warning('当前环境不支持自动复制，请手动复制')
    return
  }
  navigator.clipboard.writeText(text).then(
    () => ElMessage.success(`已复制：${label}`),
    () => ElMessage.error('复制失败，请手动复制'),
  )
}

function handleContact(c: typeof contacts[number]) {
  switch (c.action) {
    case 'qrcode':
      wechatVisible.value = true
      break
    case 'copy':
      copyText(c.value, c.display)
      break
    case 'link':
      window.open(c.value, '_blank')
      break
  }
}

function openGitee() {
  window.open('https://gitee.com/jx-xh/vue3.app', '_blank')
}

function goNotes() {
  router.push('/notes')
}
</script>

<style scoped>
.about-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 20px 80px;
}

/* ---------- 通用 ---------- */
.section {
  margin-top: 64px;
}

.section-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
}

.section-head h2 {
  font-size: 26px;
  margin: 0;
  color: #0f172a;
  position: relative;
  padding-left: 14px;
}

.section-head h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 22px;
  border-radius: 2px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.section-sub {
  color: #94a3b8;
  font-size: 14px;
}

/* ---------- Hero ---------- */
.hero {
  background: linear-gradient(135deg, #eef2ff 0%, #fdf4ff 100%);
  border-radius: 20px;
  padding: 40px 32px;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  right: -80px;
  top: -80px;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.18), transparent 70%);
}

.hero::after {
  content: '';
  position: absolute;
  left: -60px;
  bottom: -60px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%);
}

.hero-inner {
  display: flex;
  align-items: center;
  gap: 32px;
  position: relative;
  z-index: 1;
}

.hero h1 {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
}

.wave {
  display: inline-block;
  animation: wave 1.6s ease-in-out infinite;
  transform-origin: 70% 70%;
}

@keyframes wave {
  0%, 60%, 100% { transform: rotate(0); }
  10%, 30% { transform: rotate(14deg); }
  20% { transform: rotate(-8deg); }
  40% { transform: rotate(-4deg); }
}

.role {
  color: #6366f1;
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 500;
}

.bio {
  color: #475569;
  font-size: 15px;
  line-height: 1.9;
  margin: 0 0 16px;
  max-width: 560px;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.avatar-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #ec4899, #f59e0b);
  z-index: -1;
  filter: blur(8px);
  opacity: 0.7;
}

.avatar {
  border: 4px solid #fff;
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.25);
}

@media (max-width: 640px) {
  .hero-inner {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
  .hero-tags {
    justify-content: center;
  }
  .bio { margin-left: auto; margin-right: auto; }
}

/* ---------- 信息卡 ---------- */
.info-card :deep(.el-card__body),
.timeline-card :deep(.el-card__body),
.site-card :deep(.el-card__body),
.stack-card :deep(.el-card__body) {
  padding: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px;
  border-radius: 10px;
  transition: all 0.2s ease;
  margin-bottom: 12px;
}

.info-item.info-clickable {
  cursor: pointer;
}

.info-item:hover {
  background: #f8fafc;
  transform: translateY(-2px);
}

.info-icon {
  color: #6366f1;
  background: #eef2ff;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-label {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 2px;
}

.info-value {
  font-size: 14px;
  color: #0f172a;
  font-weight: 500;
}

/* ---------- 关注方向 ---------- */
.focus-card {
  height: 180px;
}

.focus-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 12px;
}

.focus-card h3 {
  margin: 0 0 8px;
  font-size: 17px;
  color: #0f172a;
}

.focus-card p {
  color: #64748b;
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
}

/* ---------- 技术栈 ---------- */
.stack-group {
  margin-bottom: 20px;
}

.stack-group:last-child { margin-bottom: 0; }

.stack-name {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 10px;
  font-weight: 500;
}

.stack-tag {
  margin-bottom: 6px;
}

/* ---------- 时间线 ---------- */
.exp-title {
  font-size: 16px;
  margin: 0 0 4px;
  color: #0f172a;
}

.exp-company {
  margin: 0 0 6px;
  color: #6366f1;
  font-size: 13px;
  font-weight: 500;
}

.exp-desc {
  margin: 0;
  color: #475569;
  font-size: 14px;
  line-height: 1.7;
  max-width: 640px;
}

/* ---------- 项目 ---------- */
.project-card {
  height: 100%;
}

.project-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 8px;
}

.project-header h3 {
  margin: 0;
  font-size: 17px;
  color: #0f172a;
}

.project-desc {
  color: #475569;
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
}

.project-divider {
  margin: 14px 0 10px;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* ---------- 站点统计 ---------- */
.stat-card :deep(.el-card__body) {
  padding: 18px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.stat-unit {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
  margin-left: 2px;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}

/* ---------- 站点说明 ---------- */
.site-card ul {
  margin: 0;
  padding-left: 20px;
  line-height: 2;
  color: #475569;
}

.site-card strong {
  color: #0f172a;
  font-weight: 600;
}

/* ---------- 兴趣爱好 ---------- */
.hobby-card {
  text-align: center;
  height: 100%;
}

.hobby-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin: 4px auto 12px;
}

.hobby-card h4 {
  margin: 0 0 6px;
  font-size: 15px;
  color: #0f172a;
}

.hobby-card p {
  color: #64748b;
  font-size: 13px;
  line-height: 1.7;
  margin: 0;
}

/* ---------- 联系方式 ---------- */
.contact-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.contact-card:hover {
  transform: translateY(-3px);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.12);
}

.contact-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px;
}

.contact-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.contact-body {
  flex: 1;
  min-width: 0;
}

.contact-label {
  font-size: 13px;
  color: #94a3b8;
}

.contact-value {
  font-size: 14px;
  color: #0f172a;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-arrow {
  color: #cbd5e1;
  transition: transform 0.2s ease, color 0.2s ease;
}

.contact-card:hover .contact-arrow {
  transform: translateX(4px);
  color: #6366f1;
}

/* ---------- 二维码弹窗 ---------- */
.qrcode-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
}

.qrcode-img {
  width: 220px;
  height: 220px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 6px;
  background: #fff;
}

.qrcode-tip {
  margin: 16px 0 0;
  font-size: 13px;
  color: #64748b;
}
</style>
