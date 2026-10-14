<template>

<header class="header">

  <div class="logo">
    Frontend Notes
  </div>


  <nav>

    <router-link to="/">
      首页
    </router-link>


    <router-link to="/notes">
      笔记
    </router-link>


    <router-link to="/about">
      关于
    </router-link>


  </nav>


</header>

</template>


<style scoped>

.header{

 height:64px;

 display:flex;

 justify-content:space-between;

 align-items:center;

 padding:0 40px;

 border-bottom:1px solid #eee;

}


.logo{

 font-size:20px;

 font-weight:bold;

}


nav{

 display:flex;

 gap:30px;

}


a{

 text-decoration:none;

 color:#333;

}


.router-link-active{

 color:#409eff;

}

</style>