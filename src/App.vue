<template>
  <div class="app">

    <Header />


    <main class="main-content">

      <router-view />

    </main>


    <Footer />


  </div>
</template>


<script setup lang="ts">

import Header from "@/components/layout/Header.vue"
import Footer from "@/components/layout/Footer.vue"

</script>


<style scoped>

.app {

  min-height:100vh;

  display:flex;

  flex-direction:column;

}


.main-content {

  flex:1;

}


</style>


<style>

body {

  margin:0;

  background-color:#f8fafc;

  background-image:
    radial-gradient(circle at 15% -10%, rgba(99,102,241,.08), transparent 45%),
    radial-gradient(circle at 85% 8%, rgba(56,189,248,.07), transparent 40%),
    linear-gradient(rgba(15,23,42,.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15,23,42,.035) 1px, transparent 1px);

  background-size:100% 100%, 100% 100%, 44px 44px, 44px 44px;

  background-attachment:fixed;

}

</style>