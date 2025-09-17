<template>
  <div class="top-bar">
    <div class="platform-name">学生服务平台</div>
  </div>
</template>

<script></script>

<style scoped>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: linear-gradient(145deg, #333, #444);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
}
.platform-name {
  font-family: "Microsoft YaHei", sans-serif;
  color: white;
}
.page-container {
  width: 100%;
  height: 100vh;
}
</style>
