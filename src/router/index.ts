import { createRouter, createWebHistory } from 'vue-router'


const router=createRouter({

 // base 跟随 vite 的 base（GitHub Pages 下为 /my-notes-blog/）
 history:createWebHistory(import.meta.env.BASE_URL),

 routes:[

  {
    path:"/",
    name:"Home",
    component:()=>import("@/views/Home.vue")
  },

  {
    path:"/notes",
    name:"Notes",
    component:()=>import("@/views/Notes.vue")
  },

  {
    path:"/notes/:dir/:slug",
    name:"NoteDetail",
    component:()=>import("@/views/NoteDetail.vue")
  },

  {
    path:"/about",
    name:"About",
    component:()=>import("@/views/About.vue")
  },

  {
    path:"/:pathMatch(.*)*",
    redirect:"/"
  }

 ]

})


export default router