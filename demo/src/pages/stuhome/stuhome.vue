<template>
  <!-- 顶部条 -->
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

  <div class="content-container">
    <!-- ===== 我的反馈（死数据 + 查看/回复按钮） ===== -->
    <div v-if="activeMenu === 'mine'" class="content-panel">
      <h2>我的反馈</h2>

      <!-- 卡片列表 -->
      <div v-for="f in feedbacks" :key="f.postId" class="card">
        <div class="card-header">{{ f.title }}</div>
        <div class="card-body">{{ f.content }}</div>
        <div class="card-footer">
          <el-tag :type="f.level === 1 ? 'danger' : 'info'">{{
            f.level === 1 ? "紧急" : "普通"
          }}</el-tag>
          <span style="margin-left: auto; font-size: 13px; color: #666"
            >提交于 {{ f.createTime }}</span
          >
        </div>
        <!-- 按钮行 -->
        <div class="card-footer" style="margin-top: 10px">
          <button class="action-btn" @click="openView(f)">查看</button>
          <button class="action-btn" @click="openReply(f)">评价</button>
        </div>
      </div>
    </div>

    <!-- 个人信息 -->
    <div v-if="activeMenu === 'profile'" class="content-panel">
      <h2>个人信息</h2>
      <div
        class="card"
        style="display: flex; align-items: flex-start; gap: 24px"
      >
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
        <el-form label-width="80px" style="flex: 1">
          <el-form-item label="姓名"
            ><el-input v-model="profile.name" placeholder="请输入姓名"
          /></el-form-item>
          <el-form-item label="学院"
            ><el-input v-model="profile.college" placeholder="请输入学院"
          /></el-form-item>
          <el-form-item label="专业"
            ><el-input v-model="profile.major" placeholder="请输入专业"
          /></el-form-item>
          <el-form-item label="班级"
            ><el-input v-model="profile.class" placeholder="请输入班级"
          /></el-form-item>
          <el-form-item label="手机"
            ><el-input v-model="profile.phone" placeholder="请输入手机"
          /></el-form-item>
          <el-form-item label="邮箱"
            ><el-input v-model="profile.email" placeholder="请输入邮箱"
          /></el-form-item>
          <el-form-item label=" ">
            <div style="width: 100%; display: flex; justify-content: center">
              <el-button
                type="primary"
                :loading="saveLoading"
                @click="handleSave"
                >保存</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 提交反馈 -->
    <div v-if="activeMenu === 'new'" class="content-panel">
      <h2>提交新反馈</h2>
      <div class="card">
        <el-form label-width="80px">
          <el-form-item label="标题"
            ><el-input v-model="form.title" placeholder="给问题起个标题"
          /></el-form-item>
          <el-form-item label="内容">
            <el-input
              type="textarea"
              :rows="4"
              v-model="form.content"
              placeholder="详细描述问题"
            />
          </el-form-item>
          <el-form-item label="图片">
            <div class="img-add-wrapper">
              <div
                v-if="picFiles.length < 3"
                class="img-box"
                @click="triggerPicSelect"
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

  <!-- ============================================================
       查看弹窗（居中卡片）
       ============================================================ -->
  <el-dialog v-model="showViewDlg" title="反馈详情" width="600px" center>
    <div class="detail-info">
      <h3>{{ viewPost.title }}</h3>
      <p class="meta">提交时间：{{ viewPost.createTime }}</p>
      <p class="meta">
        紧急程度：
        <el-tag :type="viewPost.level === 1 ? 'danger' : 'info'">
          {{ viewPost.level === 1 ? "紧急" : "普通" }}
        </el-tag>
      </p>
      <p class="content">{{ viewPost.content }}</p>

      <!-- 管理员回复框 -->
      <div class="response-box">
        <div class="response-title">管理员回复</div>
        <div class="response-content">
          {{ viewPost.response || "管理员还未回复，请耐心等待" }}
        </div>
      </div>
    </div>

    <!-- 关闭按钮：正下方 -->
    <template #footer>
      <div style="text-align: center">
        <el-button @click="showViewDlg = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- ============================================================
       回复弹窗（居中输入卡片）
       ============================================================ -->
  <el-dialog v-model="showReplyDlg" title="我要评价" width="500px" center>
    <el-input
      v-model="replyText"
      type="textarea"
      :rows="5"
      placeholder="请输入你要回复的内容"
    />
    <template #footer>
      <div style="text-align: center">
        <el-button type="primary" @click="submitReply">提交</el-button>
        <el-button @click="showReplyDlg = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { apiGetMyPosts, apiSubmitPost, apiUpdateProfile } from "@/api/post";
import { apiUpdateAvatar } from "@/api/report";

const userStore = useUserStore();
const activeMenu = ref("profile");
function switchMenu(key) {
  activeMenu.value = key;
  if (key === "mine" && feedbacks.value.length === 0) loadMyPosts();
}

/* ---- 头像 ---- */
const avatarUrl = ref("");
async function onAvatarChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    avatarUrl.value = URL.createObjectURL(file);
    const { data } = await apiUpdateAvatar(file);
    avatarUrl.value = data.avatarUrl;
    ElMessage.success("头像更新成功");
  } catch (err) {
    ElMessage.error(err?.response?.data?.msg || "头像上传失败");
    avatarUrl.value = "";
  }
}

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

/* ---- 我的反馈（死数据） ---- */
const feedbacks = ref([
  {
    postId: 1,
    title: "宿舍灯坏了",
    content: "A5-203 灯不亮，晚上出行不方便，希望尽快维修。",
    level: 1,
    createTime: "2025-06-20 09:30",
    response: "已安排维修，预计今晚完成。",
  },
  {
    postId: 2,
    title: "空调漏水",
    content: "图书馆三楼空调滴水，影响自习，请处理。",
    level: 2,
    createTime: "2025-06-19 16:00",
    response: "",
  },
  {
    postId: 3,
    title: "水龙头损坏",
    content: "东区食堂洗手池水龙头无法关闭，浪费水资源。",
    level: 1,
    createTime: "2025-06-18 12:00",
    response: "后勤已更换新龙头。",
  },
]);
const loading = ref(false);

async function loadMyPosts() {
  loading.value = true;
  try {
    const { data } = await apiGetMyPosts(userStore.userId); // ③ 调接口
    feedbacks.value = data.data || data || []; // ④ 赋值
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || "获取列表失败");
  } finally {
    loading.value = false;
  }
}

/* ---- 提交反馈 ---- */
const form = ref({
  title: "",
  content: "",
  level: 2,
  hide: 2,
});
const picFiles = ref([]);
const picInput = ref();
function triggerPicSelect() {
  picInput.value?.click();
}
function onPicChange(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  const left = 3 - picFiles.value.length;
  files.slice(0, left).forEach((f) => {
    picFiles.value.push({ file: f, url: URL.createObjectURL(f) });
  });
  e.target.value = "";
}
function removePic(idx) {
  URL.revokeObjectURL(picFiles.value[idx].url);
  picFiles.value.splice(idx, 1);
}
async function handleSubmit() {
  if (!form.value.title || !form.value.content) {
    ElMessage.warning("请填标题和内容");
    return;
  }
  const fd = new FormData();
  fd.append("userId", userStore.userId);
  fd.append("title", form.value.title);
  fd.append("content", form.value.content);
  fd.append("level", form.value.level);
  fd.append("hide", form.value.hide);
  picFiles.value.forEach((f) => fd.append("pics", f.file));
  try {
    await apiSubmitPost(fd);
    ElMessage.success("提交成功");
    form.value = { title: "", content: "", level: 2, hide: 2 };
    picFiles.value = [];
    await loadMyPosts();
    switchMenu("mine");
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || "提交失败");
  }
}

/* ---- 查看弹窗 ---- */
const showViewDlg = ref(false);
const viewPost = ref({});
function openView(p) {
  viewPost.value = p;
  showViewDlg.value = true;
}

/* ---- 回复弹窗 ---- */
const showReplyDlg = ref(false);
const replyText = ref("");
const currentReplyPost = ref({});
function openReply(p) {
  currentReplyPost.value = p;
  replyText.value = "";
  showReplyDlg.value = true;
}
function submitReply() {
  if (!replyText.value.trim()) {
    ElMessage.warning("请输入回复内容");
    return;
  }
  // 仅本地提示
  ElMessage.success("回复已提交（本地演示）");
  showReplyDlg.value = false;
}
const showDlg = ref(false);
const detail = ref({});
function openDetail(item) {
  detail.value = item;
  showDlg.value = true;
}
</script>

<style scoped>
/* -------------- 通用 -------------- */
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: linear-gradient(145deg, #333, #444);
  color: #fff;
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
  background: #333;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  z-index: 999;
}
.menu-item {
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.3s;
}
.menu-item:hover,
.menu-item.active {
  background: #555;
}
.content-container {
  margin-top: 40px;
  margin-left: 120px;
  padding: 20px;
  min-height: calc(100vh - 40px);
  background: #f5f5f5;
}
.content-panel h2 {
  margin-bottom: 20px;
  font-size: 20px;
  color: #333;
}

/* 卡片 */
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
  line-height: 1.6;
}
.card-footer {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 按钮 */
.action-btn {
  padding: 8px 16px;
  font-size: 14px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}
.action-btn:hover {
  background: #333;
}

/* 详情弹窗 */
.detail-info {
  padding: 10px 0;
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

/* 管理员回复框 */
.response-box {
  margin-top: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 12px;
  background: #fafafa;
}
.response-title {
  font-weight: bold;
  margin-bottom: 6px;
  color: #303133;
}
.response-content {
  color: #606266;
}

/* 其余原样 */
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
