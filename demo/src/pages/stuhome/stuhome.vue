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
      个人信息
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
      获取帖子
    </div>
  </div>
  <div v-if="activeMenu === 'profile'" class="profile-container">
    <div class="vertical-divider"></div>
    <div class="input-container">
      <h1 style="font-family: 'Microsoft YaHei'">基本信息</h1>
      <div class="composite-component">
        <div class="label-input-group">
          <label>姓名</label>
          <input type="text" />
        </div>
        <div class="label-input-group">
          <label>学号</label>
          <input type="text" />
        </div>
        <div class="label-input-group">
          <label>学院</label>
          <input type="text" />
        </div>
        <div class="label-input-group">
          <label>专业</label>
          <input type="text" />
        </div>
      </div>
      <h1 style="font-family: 'Microsoft YaHei'">联系方式</h1>
      <div class="label-input-group">
        <label>电话</label>
        <input type="text" />
      </div>
      <div class="label-input-group">
        <label>邮箱</label>
        <input type="text" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeMenu: "profile",
      avatar: null,
    };
  },
  methods: {
    switchMenu(menu) {
      this.activeMenu = menu;
    },
    handleAvatarChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.avatar = e.target.result;
        };
        reader.readAsDataURL(file);
      }
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
.vertical-divider {
  position: absolute;
  left: 500px;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #ccc;
}
.input-container {
  position: absolute;
  left: 510px;
  top: 220px;
}
.label-input-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.label-input-group label {
  width: 80px;
  text-align: right;
  margin-right: 10px;
}
.label-input-group input {
  width: 200px;
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
.profile-container {
  margin-left: 120px;
  padding: 20px;
}
.draggable-component {
  position: absolute;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-container {
  width: 80px;
  height: 80px;
  border: 1px solid #ddd;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-preview {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}
</style>
