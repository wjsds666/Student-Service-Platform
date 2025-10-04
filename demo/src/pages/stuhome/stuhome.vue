<template>
  <!-- 顶部条 -->
  <div class="top-bar">
    <div class="platform-name">学生服务平台</div>
  </div>

  <!-- 左侧菜单 -->
  <div class="menu-bar">
    <!-- 1. 个人信息 -->
    <div
      class="menu-item"
      :class="{ active: activeMenu === 'profile' }"
      @click="switchMenu('profile')"
    >
      个人信息
    </div>
    <!-- 2. 我的反馈 -->
    <div
      class="menu-item"
      :class="{ active: activeMenu === 'mine' }"
      @click="switchMenu('mine')"
    >
      我的反馈
    </div>
    <!-- 3. 提交反馈 -->
    <div
      class="menu-item"
      :class="{ active: activeMenu === 'new' }"
      @click="switchMenu('new')"
    >
      提交反馈
    </div>
  </div>

  <!-- 右侧内容 -->
  <div class="content-container">
    <!-- 1. 个人信息 -->
    <div v-if="activeMenu === 'profile'" class="content-panel">
      <h2>个人信息</h2>
      <div
        class="card"
        style="display: flex; align-items: flex-start; gap: 24px"
      >
        <!-- 头像 -->
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

        <!-- 表单 -->
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

    <!-- 2. 我的反馈 -->
    <div v-if="activeMenu === 'mine'" class="content-panel">
      <h2>我的反馈</h2>
      <div v-loading="loading" element-loading-text="加载中...">
        <div
          v-for="f in feedbacks"
          :key="f.postId"
          class="card"
          @click="openView(f)"
        >
          <div class="card-header">{{ f.title }}</div>
          <div class="card-body">{{ f.content }}</div>
          <div class="card-footer">
            <el-tag :type="f.level === 1 ? 'danger' : 'info'">
              {{ f.level === 1 ? "紧急" : "普通" }}
            </el-tag>
            <span style="margin-left: auto; font-size: 13px; color: #666">
              提交于 {{ f.createTime }}
            </span>
          </div>
          <div class="card-footer" style="margin-top: 10px">
            <!-- 原有按钮 -->
            <button class="action-btn" @click.stop="openView(f)">查看</button>
            <button class="action-btn" @click.stop="openReply(f)">评价</button>

            <!-- ✅ 新增：状态标签 -->
            <el-tag
              style="margin-left: auto"
              v-bind="
                f.status === '被接单'
                  ? { type: 'success' }
                  : f.status === '被取消接单'
                  ? { type: 'warning' }
                  : f.status === '接单结束'
                  ? { type: 'info' }
                  : f.status === '被标记'
                  ? { type: 'danger' }
                  : {} // ✅ 不满足时直接不给 type
              "
            >
              {{ f.status }}
            </el-tag>
          </div>
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

          <el-form-item label="图片">
            <div class="img-add-wrapper">
              <!-- 上传按钮 -->
              <div
                v-if="picFiles.length < 3"
                class="img-box"
                @click="triggerPicSelect"
              >
                <span class="plus">+</span>
              </div>
              <!-- 隐藏 file -->
              <input
                ref="picInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="onPicChange"
              />
              <!-- 预览 -->
              <div v-for="(f, idx) in picFiles" :key="idx" class="img-preview">
                <img :src="f.url" />
                <span class="close" @click.stop="removePic(idx)">×</span>
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

  <!-- 查看弹窗 -->
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
      <div class="response-box">
        <div class="response-title">管理员回复</div>
        <div class="response-content">
          {{ viewPost.response || "管理员还未回复，请耐心等待" }}
        </div>
      </div>
    </div>
    <template #footer>
      <div style="text-align: center">
        <el-button @click="showViewDlg = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 评价弹窗 -->
  <el-dialog v-model="showReplyDlg" title="我要评价" width="500px" center>
    <div style="margin-bottom: 12px">
      <span style="margin-right: 8px">满意度：</span>
      <el-rate
        v-model="replyStar"
        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
        show-score
        score-template="{value} 分"
      />
    </div>
    <el-input
      v-model="replyText"
      type="textarea"
      :rows="4"
      placeholder="请输入文字评价（选填）"
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
import "./stuhome.css";
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import {
  apiGetMyPosts,
  apiSubmitPost,
  apiUpdateProfile,
  apiComment,
} from "@/api/post";
import { apiUploadAvatar } from "@/api/user";
import { apiUploadPostImage } from "@/api/post";
import { apiGetNotifications } from "@/api/post";

/* ---------- 基础 ---------- */
const userStore = useUserStore();
const activeMenu = ref("profile");

function switchMenu(key) {
  activeMenu.value = key;
  if (key === "mine") loadMyPosts();
}

/* ---------- 头像 ---------- */
const avatarUrl = ref("");

async function onAvatarChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    avatarUrl.value = URL.createObjectURL(file);
    const { data } = await apiUploadAvatar(file);
    avatarUrl.value = data.avatarUrl;
    ElMessage.success("头像更新成功");
  } catch (err) {
    ElMessage.error(err?.response?.data?.msg || "头像上传失败");
    avatarUrl.value = "";
  } finally {
    e.target.value = "";
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
const loading = ref(false);

async function loadMyPosts() {
  loading.value = true;
  try {
    const { data } = await apiGetMyPosts(userStore.userId);
    feedbacks.value = data.data || data || [];
    await loadNotifications(); // ✅ 新增：拉通知并映射状态
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || "获取列表失败");
  } finally {
    loading.value = false;
  }
}

const notifications = ref([]); // 保存通知列表

/* 把通知映射到帖子 */
function mapStatusToFeedbacks() {
  const map = {
    接单: "被接单",
    取消接单: "被取消接单",
    完成: "接单结束",
    标记: "被标记",
  };
  feedbacks.value.forEach((f) => {
    const notice = notifications.value.find((n) => n.postId === f.postId);
    f.status = notice ? map[notice.type] || "暂无状态" : "暂无状态";
  });
}

/* 拉取通知并映射 */
async function loadNotifications() {
  try {
    const { data } = await apiGetNotifications(userStore.userId);
    notifications.value = data || [];
    mapStatusToFeedbacks();
  } catch (e) {
    ElMessage.error("获取通知失败");
  }
}

/* ---------- 提交反馈 ---------- */
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

async function onPicChange(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  const left = 3 - picFiles.value.length;
  for (const f of files.slice(0, left)) {
    try {
      const { data } = await apiUploadPostImage(f);
      picFiles.value.push({ file: f, url: data.url });
    } catch (err) {
      ElMessage.error(err?.response?.data?.msg || "图片上传失败");
    }
  }
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

/* ---------- 查看弹窗 ---------- */
const showViewDlg = ref(false);
const viewPost = ref({});

function openView(p) {
  viewPost.value = p;
  showViewDlg.value = true;
}

/* ---------- 评价弹窗 ---------- */
const showReplyDlg = ref(false);
const replyText = ref("");
const replyStar = ref(5);
const currentReplyPost = ref({});

function openReply(p) {
  currentReplyPost.value = p;
  replyText.value = "";
  replyStar.value = 5;
  showReplyDlg.value = true;
}

async function submitReply() {
  if (!replyStar.value) {
    ElMessage.warning("请先选择星级");
    return;
  }
  try {
    await apiComment({
      postId: currentReplyPost.value.postId,
      userId: userStore.userId,
      content: replyText.value.trim(),
      star: replyStar.value,
    });
    ElMessage.success("评价已提交");
    showReplyDlg.value = false;
    await loadMyPosts();
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || "提交失败");
  }
}

/* ---------- 生命周期 ---------- */
onMounted(() => switchMenu("profile"));
</script>
