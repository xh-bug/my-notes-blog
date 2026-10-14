import { createRouter, createWebHistory } from 'vue-router'


const router=createRouter({

 history:createWebHistory(),

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