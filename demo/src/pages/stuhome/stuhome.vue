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
    <!-- ===== 我的反馈 ===== -->
    <div v-if="activeMenu === 'mine'" class="content-panel">
      <h2>我的反馈</h2>
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

  <!-- 评价弹窗：星级 + 文字 -->
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
import { apiUpdateAvatar } from "@/api/report";
import { apiUploadAvatar } from "@/api/user";
import { apiUploadPostImage } from "@/api/post";

const userStore = useUserStore();
const activeMenu = ref("profile");
function switchMenu(key) {
  activeMenu.value = key;
  if (key === "mine") loadMyPosts();
}

/* ---- 头像 ---- */
const avatarUrl = ref("");

async function onAvatarChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    // 1. 先本地预览
    avatarUrl.value = URL.createObjectURL(file);
    // 2. 调接口上传
    const { data } = await apiUploadAvatar(file);
    // 3. 用后台返回的真实地址回显（Mock 给的）
    avatarUrl.value = data.avatarUrl;
    ElMessage.success("头像更新成功");
  } catch (err) {
    ElMessage.error(err?.response?.data?.msg || "头像上传失败");
    avatarUrl.value = "";
  } finally {
    // 清空 input，允许重复选同一张图
    e.target.value = "";
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

/* ---- 我的反馈 ---- */
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
    const { data } = await apiGetMyPosts(userStore.userId);
    feedbacks.value = data.data || data || [];
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
async function onPicChange(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  const left = 3 - picFiles.value.length;
  for (const f of files.slice(0, left)) {
    try {
      // 1. 先上传到 Mock
      const { data } = await apiUploadPostImage(f);
      // 2. 把返回的真实地址放进预览数组
      picFiles.value.push({
        file: f, // 保留文件对象（万一后面还要提交）
        url: data.url, // 用后端返回的 URL
      });
    } catch (err) {
      ElMessage.error(err?.response?.data?.msg || "图片上传失败");
    }
  }
  // 允许重复选同一张图
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

/* ---- 评价弹窗 ---- */
const showReplyDlg = ref(false);
const replyText = ref("");
const replyStar = ref(5); // 新增：默认 5 星
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
</script>