<template>
  <div class="top-bar">
    <div class="platform-name">学生服务平台</div>
  </div>
  <div class="menu-bar">
    <div
      class="menu-item"
      :class="{ active: activeMenu === 'profile' }"
      @click="switchMenu('profile')"
    >
      个人简介
    </div>
    <div
      class="menu-item"
      :class="{ active: activeMenu === 'feedback' }"
      @click="switchMenu('feedback')"
    >
      反馈情况
    </div>
    <div
      class="menu-item"
      :class="{ active: activeMenu === 'evaluation' }"
      @click="switchMenu('evaluation')"
    >
      处理评价
    </div>
  </div>
  <div class="profile-content" v-if="activeMenu === 'profile'">
    <div class="form-group">
      <label>姓名</label>
      <input type="text" placeholder="请输入姓名" />
    </div>
    <div class="form-group">
      <label>学号</label>
      <input type="text" placeholder="请输入学号" />
    </div>
    <div class="form-group">
      <label>班级</label>
      <input type="text" placeholder="请输入班级" />
    </div>
    <div class="form-group">
      <label>专业</label>
      <input type="text" placeholder="请输入专业" />
    </div>
    <div class="form-group">
      <label>学院</label>
      <input type="text" placeholder="请输入学院" />
    </div>
    <div class="form-group">
      <label>电话</label>
      <input type="text" placeholder="请输入电话" />
    </div>
    <div class="form-group">
      <label>邮箱</label>
      <input type="text" placeholder="请输入邮箱" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeMenu: "profile",
    };
  },
  methods: {
    switchMenu(menu) {
      this.activeMenu = menu;
      // 这里可以添加页面切换逻辑
    },
  },
};
</script>

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
.menu-bar {
  position: fixed;
  left: 0;
  top: 40px;
  width: 120px;
  height: calc(100vh - 40px);
  background-color: #333;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  z-index: 1000;
}
.menu-item {
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.menu-item:hover,
.menu-item.active {
  background-color: #555;
}
.profile-content {
  margin-left: 120px;
  padding: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}
.form-group label {
  margin-bottom: 5px;
  font-size: 14px;
}
.form-group input {
  border-radius: 8px;
  padding: 10px;
  border: 1px solid #ccc;
}
</style>
