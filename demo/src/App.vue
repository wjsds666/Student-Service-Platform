<template>
      <div class="page-container">
        <router-view></router-view>
      </div>
    </template>

    <style scoped>
    .page-container {
      width: 100%;
      height: 100vh;
    }
    </style>

    <script>
    export default {
      name: 'App'
    }
    </script>