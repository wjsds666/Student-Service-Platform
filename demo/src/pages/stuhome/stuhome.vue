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
    <div class="avatar-upload-container">
      <input
        type="file"
        accept="image/*"
        @change="handleAvatarChange"
        style="display: none"
        ref="fileInput"
      />
      <div class="avatar-preview" @click="$refs.fileInput.click()">
        <img v-if="avatar" :src="avatar" class="avatar-image" />
        <div v-else class="avatar-placeholder">点击上传头像</div>
      </div>
    </div>
    <div class="divider"></div>
<div class="basic-info">
      <h3>基本介绍</h3>
      <div class="info-box">
        <div class="info-item">
          <label>姓名</label>
          <input type="text" v-model="name" placeholder="请输入姓名" />
        </div>
        <div class="info-item">
          <label>班级</label>
          <input type="text" v-model="class" placeholder="请输入班级" />
        </div>
        <div class="info-item">
          <label>学院</label>
          <input type="text" v-model="college" placeholder="请输入学院" />
        </div>
        <div class="info-item">
          <label>专业</label>
          <input type="text" v-model="major" placeholder="请输入专业" />
        </div>
      </div>
    </div>
    <div class="contact-info">
      <h3>联系方式</h3>
      <div class="info-box">
        <div class="info-item">
          <label>电话</label>
          <input type="text" v-model="phone" placeholder="请输入电话" />
        </div>
        <div class="info-item">
          <label>邮箱</label>
          <input type="text" v-model="email" placeholder="请输入邮箱" />
        </div>
      </div>
    </div>
    <div class="profile-info">
      <h3>个人简介</h3>
      <textarea v-model="profile" placeholder="这个人很懒什么都没留下"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeMenu: "profile",
      avatar: null,
      profile: "",
      name: "",
      class: "",
      college: "",
      major: "",
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
.divider {
  width: 1px;
  height: 100%;
  background-color: #ccc;
  margin: 0 20px;
}
.contact-info {
  position: absolute;
  bottom: 120px;
  right: 220px;
  width: 40%;
}
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
.basic-info {
  position: absolute;
  top: 60px;
  right: 220px;
  width: 40%;
}
.basic-info h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}
.info-box {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 15px;
  margin-top: 10px;
}
.info-item {
  margin-bottom: 15px;
}
.info-item label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.info-item input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.profile-info {
  margin-top: 20px;
  width: 25%;
  max-width: 200px;
}
.profile-info h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}
.profile-info textarea {
  width: 100%;
  height: 100px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}
.avatar-upload-container {
  position: relative;
  width: 25%;
  max-width: 200px;
  margin-top: 40px;
}
.avatar-preview {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  border: 2px dashed #ccc;
}
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-placeholder {
  color: #666;
  font-size: 14px;
  text-align: center;
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
