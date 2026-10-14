<template>
  <div class="home-page">

    <!-- Hero -->
    <section class="hero">

      <div class="hero-content">

    <h1>Frontend Notes · 小何的 JavaScript 之路</h1>
<p>专注 Vue / React / Node.js，记录工程化落地、性能调优与技术决策</p>
<p>把真实项目里的坑与解法，写成下次能直接用的经验</p>


        <div class="hero-buttons">

          <el-button 
            type="primary"
            size="large"
            @click="goNotes"
          >
            查看笔记
          </el-button>


          <el-button 
            size="large" @click="GOgitee()"
          >
            Gitee
          </el-button>

        </div>


      </div>


    </section>



    <!-- 技术分类 -->

    <section class="section">

      <h2>
        技术分类
      </h2>


      <el-row :gutter="20">


        <el-col
          v-for="item in categories"
          :key="item.name"
          :xs="24"
          :sm="12"
          :md="6"
        >

          <el-card
            shadow="hover"
            class="category-card"
            @click="openCategory(item.name)"
          >

            <div class="icon">
              {{ item.icon }}
            </div>


            <h3>
              {{ item.name }}
            </h3>


            <p>
              {{ item.count }} 篇文章
            </p>


          </el-card>


        </el-col>


      </el-row>


    </section>




    <!-- 最新文章 -->

    <section class="section">


      <h2>
        最新文章
      </h2>


      <el-card
        v-for="article in articles"
        :key="article.slug"
        class="article-card"
        shadow="hover"
        @click="openPost(article)"
      >

        <div class="article">


          <div>

            <h3>
              {{article.title}}
            </h3>


            <p>
              {{article.desc}}
            </p>


            <el-tag>
              {{article.tag}}
            </el-tag>


          </div>



          <time>
            {{article.date}}
          </time>


        </div>


      </el-card>


    </section>




    <!-- 技术栈 -->


    <section class="section stack">


      <h2>
        技术栈
      </h2>


      <el-space wrap>


        <el-tag
          v-for="tech in stack"
          :key="tech"
          size="large"
        >

          {{tech}}

        </el-tag>


      </el-space>


    </section>



  </div>
</template>



<script setup lang="ts">

import { useRouter } from "vue-router"
import { posts, categories as categoryStats } from "@/utils/posts"


interface Category {

  name:string

  count:number

  icon:string

}



interface Article {

  title:string

  desc:string

  tag:string

  date:string

  dir:string

  slug:string

}



const iconMap:Record<string,string>={

  "Vue":"🟢",

  "React":"⚛️",

  "Node.js":"🟩",

  "性能优化":"🚀"

}

const categories:Category[]=categoryStats.map(item=>({

  name:item.name,

  count:item.count,

  icon:iconMap[item.name] || "📄"

}))




const articles:Article[]=posts.slice(0,4).map(item=>({

  title:item.title,

  desc:item.desc,

  tag:item.tag,

  date:item.date,

  dir:item.dir,

  slug:item.slug

}))




const stack:string[]=[

  "Vue3",
  "React18",
  "TypeScript",
  "Node.js",
  "Vite",
  "Webpack",
  "Git"

]

function GOgitee(){
  window.open('https://gitee.com/jx-xh/vue3.app', '_blank')
}

const router=useRouter()

function goNotes(){
  router.push("/notes")
}

function openCategory(name:string){
  router.push({ path:"/notes", query:{ cat:name } })
}

function openPost(item:Article){
  router.push(`/notes/${item.dir}/${item.slug}`)
}


</script>



<style scoped>


.home-page{

  max-width:1200px;

  margin:0 auto;

  padding:40px 20px;

}



.hero{

  padding:100px 20px;

  text-align:center;

  border-radius:16px;

  background-color:#0f172a;

  background-image:
    radial-gradient(circle at 50% -10%, rgba(99,102,241,.30), transparent 55%),
    linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px),
    linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #312e81 100%);

  background-size:100% 100%, 44px 44px, 44px 44px, 100% 100%;

}



.hero h1{

  font-size:52px;

  margin-bottom:20px;

  font-weight:700;

  color:#f1f5f9;

}



.hero p{

  font-size:20px;

  color:#94a3b8;

  max-width:700px;

  margin:0 auto 35px;

  line-height:1.8;

}



.hero-buttons{

  display:flex;

  justify-content:center;

  gap:15px;

}



.section{

  margin-top:70px;

}



.section h2{

  font-size:30px;

  margin-bottom:30px;

}



.category-card{

  text-align:center;

  height:180px;

}



.icon{

  font-size:40px;

}



.category-card h3{

  margin:15px 0;

}



.article-card{

  margin-bottom:15px;

}



.article{

  display:flex;

  justify-content:space-between;

  align-items:center;

}



.article h3{

  margin:0 0 10px;

}



.article p{

  color:#666;

}



.article time{

  color:#999;

}



.stack{

  padding-bottom:80px;

}


</style>