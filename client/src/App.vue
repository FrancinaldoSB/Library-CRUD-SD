<template>
  <div class="app-container">
    <router-view></router-view>
  </div>
</template>

<script setup>
// Sem lógica adicional necessária
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Teachers:wght@400&family=Tilt+Warp&family=Urbanist:ital,wght@0,400;0,700;1,400;1,700&display=swap');

.app-container {
  width: 100%;
  height: 100vh;
  display: block;
}

/* Reset básico para garantir que não haja margens ou paddings interferindo */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>
