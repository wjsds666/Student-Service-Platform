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
        v-for="f in feedbacks"
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

    <!-- 3. 提交反馈（含图片，无文字） -->
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

          <!-- 图片上传：无文字，只有方框+加号 -->
          <el-form-item label="图片">
            <div class="img-add-wrapper">
              <div
                class="img-box"
                @click="triggerPicSelect"
                v-if="picFiles.length < 3"
              >
                <span class="plus">+</span>
              </div>
              <input
                ref="picInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="onPicChange"
              />
              <!-- 预览图 -->
              <div v-for="(f, idx) in picFiles" :key="idx" class="img-preview">
                <img :src="f.url" />
                <span class="close" @click="removePic(idx)">×</span>
              </div>
            </div>
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
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { apiGetMyPosts, apiSubmitPost, apiUpdateProfile } from "@/api/post";
import { apiUpdateAvatar } from "@/api/report";

/* ---------- 用户信息 ---------- */
const userStore = useUserStore();

/* ---------- 菜单 ---------- */
const activeMenu = ref("profile");
function switchMenu(key) {
  activeMenu.value = key;
  if (key === "mine" && feedbacks.value.length === 0) {
    loadMyPosts();
  }
}

/* ---------- 头像 ---------- */

async function onAvatarChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    // 1. 先本地预览（瞬间）
    avatarUrl.value = URL.createObjectURL(file);

    // 2. 上传头像
    const { data } = await apiUpdateAvatar(file);
    // 3. 用返回的真实地址更新头像
    avatarUrl.value = data.avatarUrl;
    ElMessage.success("头像更新成功");
  } catch (err) {
    ElMessage.error(err?.response?.data?.msg || "头像上传失败");
    avatarUrl.value = ""; // 恢复为空
  }
}
/* ---------- 个人信息 ---------- */
const profile = ref({
  name: "张三",
  college: "计算机学院",
  major: "软件工程",
  class: "软工2022级3班",
  phone: "13800138000",
  email: "zhangsan@mail.com",
});
const saveLoading = ref(false);
async function handleSave() {
  saveLoading.value = true;
  try {
    const { data } = await apiUpdateProfile({
      userId: userStore.userId,
      ...profile.value,
    });
    Object.assign(profile.value, data);
    ElMessage.success("个人信息已更新");
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || "更新失败");
  } finally {
    saveLoading.value = false;
  }
}

/* ---------- 我的反馈 ---------- */
const feedbacks = ref([]);
async function loadMyPosts() {
  const { data } = await apiGetMyPosts(userStore.userId);
  feedbacks.value = data;
}

/* ---------- 提交反馈（含图片） ---------- */
const form = ref({
  title: "",
  content: "",
  level: 2,
  hide: 2,
});
// 本地图片列表
const picFiles = ref([]);
// 触发选图
function triggerPicSelect() {
  picInput.value?.click();
}
// 选图回调
const picInput = ref();
function onPicChange(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  // 最多 3 张
  const left = 3 - picFiles.value.length;
  const toAdd = files.slice(0, left);
  toAdd.forEach((f) => {
    picFiles.value.push({ file: f, url: URL.createObjectURL(f) });
  });
  // 清空 input，允许重复选同一张
  e.target.value = "";
}
// 删除预览
function removePic(idx) {
  URL.revokeObjectURL(picFiles.value[idx].url);
  picFiles.value.splice(idx, 1);
}

async function handleSubmit() {
  if (!form.value.title || !form.value.content) {
    ElMessage.warning("请填标题和内容");
    return;
  }
  // 构造 FormData，支持多图
  const fd = new FormData();
  fd.append("userId", userStore.userId);
  fd.append("title", form.value.title);
  fd.append("content", form.value.content);
  fd.append("level", form.value.level);
  fd.append("hide", form.value.hide);
  picFiles.value.forEach((f) => fd.append("pics", f.file));

  try {
    await apiSubmitPost(fd); // 后端接口需支持 multipart/form-data
    ElMessage.success("提交成功");
    // 重置表单
    form.value = { title: "", content: "", level: 2, hide: 2 };
    picFiles.value = [];
    await loadMyPosts();
    switchMenu("mine");
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || "提交失败");
  }
}

/* ---------- 详情弹窗 ---------- */
const showDlg = ref(false);
const detail = ref({});
function openDetail(item) {
  detail.value = item;
  showDlg.value = true;
}
</script>

<style scoped>
/* 原来 stuhome.css 里的内容原封不动搬过来 */
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

/* 图片上传样式（无文字） */
.img-add-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.img-box {
  width: 80px;
  height: 80px;
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s;
}
.img-box:hover {
  border-color: #409eff;
}
.plus {
  font-size: 24px;
  color: #909399;
}
.img-preview {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
}
.img-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.close {
  position: absolute;
  top: 2px;
  right: 4px;
  font-size: 16px;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 18px;
  height: 18px;
  text-align: center;
  line-height: 18px;
  cursor: pointer;
}
</style>
