<template>
    <div class="admin-header">
      管理员页面
    </div>
    <div class="left-sidebar"></div>
    <div class="button-container">
      <button class="action-button">查看反馈</button>
      <button class="action-button">我的接单</button>
      <button class="action-button">审核情况</button>
    </div>
</template>

<style>
.admin-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #333;
  width: 100%;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
  padding: 15px 0;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.left-sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  width: 150px;
  background-color: #e0e0e0;
  z-index: 999;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 100px;
}

.action-button {
  padding: 15px 40px;
  font-size: 16px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 200px;
}

.action-button:hover {
  background-color: #333333;
}
</style>