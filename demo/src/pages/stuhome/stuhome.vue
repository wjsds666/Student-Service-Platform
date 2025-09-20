<template>
  <!-- 顶部条 -->
  <div class="top-bar">
    <div class="platform-name">学生服务平台</div>
  </div>

  <!-- 左侧菜单 -->
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
      :class="{ active: activeMenu === 'mine' }"
      @click="switchMenu('mine')"
    >
      我的反馈
    </div>
    <div
      class="menu-item"
      :class="{ active: activeMenu === 'new' }"
      @click="switchMenu('new')"
    >
      提交反馈
    </div>
  </div>

  <!-- 右侧内容区 -->
  <div class="content-container">
    <!-- 1. 个人信息 -->
    <div v-if="activeMenu === 'profile'" class="content-panel">
      <h2>个人信息</h2>
      <div
        class="card"
        style="display: flex; align-items: flex-start; gap: 24px"
      >
        <!-- 左侧圆形头像 -->
        <div class="avatar-box">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="onAvatarChange"
          />
          <div class="avatar-circle" @click="$refs.fileInput.click()">
            <img v-if="avatarUrl" :src="avatarUrl" class="avatar-img" />
            <div v-else class="avatar-placeholder">点击添加头像</div>
          </div>
        </div>

        <!-- 右侧表单 -->
        <el-form label-width="80px" style="flex: 1">
          <el-form-item label="姓名">
            <el-input v-model="profile.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="学院">
            <el-input v-model="profile.college" placeholder="请输入学院" />
          </el-form-item>
          <el-form-item label="专业">
            <el-input v-model="profile.major" placeholder="请输入专业" />
          </el-form-item>
          <el-form-item label="班级">
            <el-input v-model="profile.class" placeholder="请输入班级" />
          </el-form-item>
          <el-form-item label="手机">
            <el-input v-model="profile.phone" placeholder="请输入手机" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="profile.email" placeholder="请输入邮箱" />
          </el-form-item>

          <!-- 保存按钮 -->
          <el-form-item label=" ">
            <div style="width: 100%; display: flex; justify-content: center">
              <el-button
                type="primary"
                @click="handleSave"
                :loading="saveLoading"
              >
                保存
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 2. 我的反馈 -->
    <div v-if="activeMenu === 'mine'" class="content-panel">
      <h2>我的反馈</h2>
      <div
        class="card"
        v-for="f in fakeFeedbacks"
        :key="f.postId"
        @click="openDetail(f)"
      >
        <div class="card-header">{{ f.title }}</div>
        <div class="card-body">{{ f.content }}</div>
        <div class="card-footer">
          <el-tag :type="f.level === 1 ? 'danger' : 'info'">
            {{ f.level === 1 ? "紧急" : "普通" }}
          </el-tag>
          <span style="margin-left: auto">提交于 {{ f.createTime }}</span>
        </div>
      </div>
    </div>

    <!-- 3. 提交反馈 -->
    <div v-if="activeMenu === 'new'" class="content-panel">
      <h2>提交新反馈</h2>
      <div class="card">
        <el-form label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="form.title" placeholder="给问题起个标题" />
          </el-form-item>
          <el-form-item label="内容">
            <el-input
              type="textarea"
              :rows="4"
              v-model="form.content"
              placeholder="详细描述问题"
            />
          </el-form-item>
          <el-form-item label="紧急">
            <el-switch
              v-model="form.level"
              :active-value="1"
              :inactive-value="2"
            />
          </el-form-item>
          <el-form-item label="匿名">
            <el-switch
              v-model="form.hide"
              :active-value="1"
              :inactive-value="2"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>

  <!-- 详情弹窗 -->
  <el-dialog v-model="showDlg" title="反馈详情" width="600px">
    <div class="detail-info">
      <h3>{{ detail.title }}</h3>
      <p class="meta">提交时间：{{ detail.createTime }}</p>
      <p class="meta">
        紧急：
        <el-tag :type="detail.level === 1 ? 'danger' : 'info'">
          {{ detail.level === 1 ? "紧急" : "普通" }}
        </el-tag>
      </p>
      <p class="content">{{ detail.content }}</p>
      <p v-if="detail.response" class="response">
        管理员回复：{{ detail.response }}
      </p>
    </div>
    <template #footer>
      <el-button @click="showDlg = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
/* ===== 头像（死模板） ===== */
const avatarUrl = ref(""); // 预览地址

function onAvatarChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  avatarUrl.value = URL.createObjectURL(file);
}

/* ===== 个人信息 ===== */
const profile = ref({
  name: "张三",
  college: "计算机学院",
  major: "软件工程",
  class: "软工2022级3班",
  phone: "13800138000",
  email: "zhangsan@mail.com",
});

const saveLoading = ref(false); // 防止重复点击
async function handleSave() {
  saveLoading.value = true;
  try {
    // 1. 调接口（Apifox 本地 Mock）
    const { data } = await apiUpdateProfile({
      userId: userStore.userId,
      ...profile.value,
    });
    // 2. 用返回的数据回显（Apifox 会把完整字段返给你）
    Object.assign(profile.value, data);
    ElMessage.success("个人信息已更新");
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || "更新失败");
  } finally {
    saveLoading.value = false;
  }
}

import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
// 取当前登录学生的 userId
const userStore = useUserStore(); // ← 新增
import { apiSubmitPost } from "@/api/post"; // 我们刚封装的发布接口
import { apiUpdateProfile } from "@/api/user"; // 顶部引入
/* ===== 菜单 ===== */
const activeMenu = ref("profile");
function switchMenu(key) {
  activeMenu.value = key;
}

/* ===== 假数据 ===== */
const fakeFeedbacks = ref([
  {
    postId: 1,
    title: "宿舍灯坏了",
    content: "A5-203 房顶灯管不亮，请尽快维修，谢谢！",
    level: 1,
    createTime: "2025-06-20 09:30",
    response: "已安排师傅，今晚 7 点到场。",
  },
  {
    postId: 2,
    title: "图书馆空调太冷",
    content: "三楼自习室空调温度过低，能否调高一点？",
    level: 2,
    createTime: "2025-06-19 16:00",
    response: null,
  },
]);

/* ===== 提交反馈假表单 ===== */
const form = ref({
  title: "",
  content: "",
  level: 2,
  hide: 2,
});
async function handleSubmit() {
  if (!form.value.title || !form.value.content) {
    ElMessage.warning("请填标题和内容");
    return;
  }

  const payload = {
    userId: userStore.userId,
    title: form.value.title,
    content: form.value.content,
    level: form.value.level, // 1=紧急  2=普通
    hide: form.value.hide, // 1=匿名  2=不匿名
  };

  try {
    // 真正连后端（Apifox 云端）
    await apiSubmitPost(payload);
    ElMessage.success("提交成功"); // ← 成功弹窗
    form.value.title = "";
    form.value.content = "";
    switchMenu("mine"); // 可选：立即跳到“我的反馈”
  } catch (e) {
    // 任何错误（500/网络/超时）都进这里
    ElMessage.error(e?.response?.data?.msg || "提交失败");
  }
}

/* ===== 弹窗 ===== */
const showDlg = ref(false);
const detail = ref({});
function openDetail(item) {
  detail.value = item;
  showDlg.value = true;
}
</script>

<style scoped>
/* 完全复用 admhome 的样式，保持一致 */
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.2);
}
.platform-name {
  font-family: "Microsoft YaHei", sans-serif;
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
  z-index: 999;
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
.content-container {
  margin-top: 40px;
  margin-left: 120px;
  padding: 20px;
  min-height: calc(100vh - 40px);
  background-color: #f5f5f5;
}
.content-panel h2 {
  margin-bottom: 20px;
  font-size: 20px;
  color: #333;
}
.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.card-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.card-body {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}
.card-footer {
  display: flex;
  align-items: center;
  gap: 10px;
}
.detail-info h3 {
  margin: 0 0 10px;
}
.meta {
  margin: 4px 0;
  font-size: 14px;
  color: #555;
}
.content {
  margin: 10px 0;
  line-height: 1.6;
}
.response {
  margin-top: 10px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}
.avatar-box {
  flex-shrink: 0;
}
.avatar-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s;
}
.avatar-circle:hover {
  border-color: #409eff;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-placeholder {
  color: #999;
  font-size: 14px;
}
</style>
