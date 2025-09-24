<template></template>
<template>
  <!-- 顶部条 -->
  <div class="top-bar">
    <div class="platform-name">管理员中心</div>
  </div>

  <!-- 左侧菜单 -->
  <div class="menu-bar">
    <div
      class="menu-item"
      :class="{ active: activeMenu === 'feedback' }"
      @click="onFeedbackClick"
    >
      查看反馈
    </div>
    <div
      class="menu-item"
      :class="{ active: activeMenu === 'orders' }"
      @click="onOrdersClick"
    >
      我的接单
    </div>
    <div
      class="menu-item"
      :class="{ active: activeMenu === 'audit' }"
      @click="onAuditClick"
    >
      垃圾审核
    </div>
  </div>

  <!-- 右侧内容区 -->
  <div class="content-container">
    <!-- 1. 查看反馈 -->
    <div v-if="activeMenu === 'feedback'" class="content-panel">
      <h2>待处理反馈</h2>
      <div v-loading="loading" element-loading-text="加载中...">
        <div
          class="card"
          v-for="p in feedbackPosts"
          :key="p.postId"
          @click="openDetail(p)"
        >
          <div class="card-header">{{ p.title }}</div>
          <div class="card-body">{{ p.content }}</div>
          <div class="card-footer">
            <button class="action-btn" @click.stop="handleClaim(p)">
              接单
            </button>
            <button class="action-btn" @click.stop="handleReply(p)">
              回复
            </button>
            <button class="action-btn danger" @click.stop="handleDelete(p)">
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 我的接单 -->
    <div v-if="activeMenu === 'orders'" class="content-panel">
      <h2>我的接单</h2>
      <div v-loading="loading" element-loading-text="加载中...">
        <div
          class="card"
          v-for="p in orderPosts"
          :key="p.postId"
          @click="openDetail(p)"
        >
          <div class="card-header">{{ p.title }}</div>
          <div class="card-body">{{ p.content }}</div>
          <div class="card-footer">
            <button class="action-btn" @click.stop="handleComplete(p)">
              完成
            </button>
            <button class="action-btn" @click.stop="handleReply(p)">
              回复
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 所有帖子（入口已删，页面仍保留） -->
    <div v-if="activeMenu === 'posts'" class="content-panel">
      <h2>所有帖子</h2>
      <div v-loading="loading" element-loading-text="加载中...">
        <div
          class="card"
          v-for="p in allPosts"
          :key="p.postId"
          @click="openDetail(p)"
        >
          <div class="card-header">{{ p.title }}</div>
          <div class="card-body">{{ p.content }}</div>
          <div class="card-footer">
            <button class="action-btn danger" @click.stop="handleDelete(p)">
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. 垃圾审核（含「被管理员标记的帖子」卡片） -->
    <div v-if="activeMenu === 'audit'" class="content-panel">
      <h2>垃圾信息审核</h2>

      <!-- 被管理员标记的帖子卡片 -->
      <div class="card admin-marked" v-if="adminMarked">
        <div class="card-header">管理员已标记</div>
        <div class="card-body">
          <p><strong>标题：</strong>{{ adminMarked.title }}</p>
          <p><strong>内容：</strong>{{ adminMarked.content }}</p>
          <p><strong>标记人：</strong>{{ adminMarked.reporter }}</p>
          <p><strong>理由：</strong>{{ adminMarked.reason }}</p>
          <p><strong>时间：</strong>{{ adminMarked.createTime }}</p>
          <p>
            紧急程度：
            <el-tag :type="adminMarked.level === 1 ? 'danger' : 'info'">
              {{ adminMarked.level === 1 ? "紧急" : "普通" }}
            </el-tag>
          </p>
        </div>
        <div class="card-footer">
          <button class="action-btn" @click="handleAuditReject(adminMarked)">
            驳回
          </button>
          <button
            class="action-btn danger"
            @click="handleAuditDelete(adminMarked)"
          >
            删除
          </button>
        </div>
      </div>

      <div v-loading="loading" element-loading-text="加载中...">
        <div class="card" v-for="r in reportList" :key="r.postId">
          <div class="card-header">{{ r.title }}</div>
          <div class="card-body">
            <p><strong>举报理由：</strong>{{ r.reason }}</p>
            <p><strong>提交人：</strong>{{ r.reporter }}</p>
          </div>
          <div class="card-footer">
            <button class="action-btn" @click.stop="handleAuditReject(r)">
              驳回
            </button>
            <button
              class="action-btn danger"
              @click.stop="handleAuditDelete(r)"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 大图弹窗 -->
  <el-dialog v-model="showDlg" title="详情" width="700px" center>
    <el-carousel
      v-if="detail.picUrls?.length"
      height="400px"
      indicator-position="outside"
    >
      <el-carousel-item v-for="(url, idx) in detail.picUrls" :key="idx">
        <el-image
          :src="url"
          :preview-src-list="detail.picUrls"
          fit="contain"
          class="gallery-img"
        />
      </el-carousel-item>
    </el-carousel>

    <div class="detail-info">
      <h3>{{ detail.title }}</h3>
      <p class="meta">提交时间：{{ detail.createTime }}</p>
      <p class="meta">
        紧急程度：
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
      <el-button
        type="primary"
        @click="handleClaim(detail)"
        v-if="activeMenu === 'feedback'"
        >接单</el-button
      >
      <el-button type="primary" @click="handleReply(detail)">回复</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { apiReportPost } from "@/api/report";
import {
  apiGetAllPosts,
  apiSelectOrders,
  apiAcceptPost,
  apiReplyPost,
} from "@/api/post";
import { apiGetReports } from "@/api/report";

const userStore = useUserStore();
const activeMenu = ref("feedback");
const showDlg = ref(false);
const detail = ref({});
const loading = ref(false);

/* ---------- 数据 ---------- */
const feedbackPosts = ref([]);
const orderPosts = ref([]);
const allPosts = ref([
  {
    postId: 1,
    title: "宿舍灯坏了",
    content: "A5-203 灯不亮",
    level: 1,
    createTime: "2025-06-20 09:30",
    response: null,
  },
  {
    postId: 2,
    title: "空调太冷",
    content: "三楼空调温度低",
    level: 2,
    createTime: "2025-06-19 16:00",
    response: null,
  },
]);
const reportList = ref([
  { postId: 3, title: "垃圾广告", reason: "内容无效", reporter: "学生A" },
  { postId: 4, title: "重复提交", reason: "恶意刷屏", reporter: "学生B" },
]);

// 被管理员标记的帖子（顶部卡片）
const adminMarked = ref(null);

/* ---------- 拉取函数 ---------- */
async function loadFeedback() {
  loading.value = true;
  try {
    const { data } = await apiGetAllPosts({ state: 1 });
    feedbackPosts.value = data;
  } finally {
    loading.value = false;
  }
}
async function loadOrders() {
  loading.value = true;
  try {
    const { data } = await apiSelectOrders({ state: 2 });
    orderPosts.value = data;
  } finally {
    loading.value = false;
  }
}
async function loadAllPosts() {
  loading.value = true;
  setTimeout(() => (loading.value = false), 300);
}
async function loadAudit() {
  loading.value = true;
  try {
    const { data } = await apiGetReports();
    reportList.value = data;
    // 取第一条作为管理员标记的帖子
    adminMarked.value = data.length ? data[0] : null;
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || "获取审核列表失败");
  } finally {
    loading.value = false;
  }
}

/* ---------- 弹窗 ---------- */
function openDetail(post) {
  detail.value = post;
  showDlg.value = true;
}

/* ---------- 按钮事件 ---------- */
async function handleClaim(post) {
  try {
    await apiAcceptPost({ userId: userStore.userId, postId: post.postId });
    ElMessage.success("接单成功");
    loadFeedback();
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || "接单失败");
  }
}
async function handleReply(post) {
  try {
    await apiReplyPost({
      userId: userStore.userId,
      postId: post.postId,
      response: "已处理",
    });
    ElMessage.success("回复成功");
    if (activeMenu.value === "feedback") loadFeedback();
    if (activeMenu.value === "orders") loadOrders();
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || "回复失败");
  }
}
async function handleDelete(post) {
  const target = activeMenu.value === "feedback" ? feedbackPosts : allPosts;
  target.value = target.value.filter((p) => p.postId !== post.postId);
  ElMessage.success("已删除");
}
async function handleComplete(post) {
  ElMessage.success("已完成");
}
async function handleAuditReject(r) {
  reportList.value = reportList.value.filter((x) => x.postId !== r.postId);
  adminMarked.value = reportList.value.length ? reportList.value[0] : null;
  ElMessage.success("已驳回");
}
async function handleAuditDelete(r) {
  reportList.value = reportList.value.filter((x) => x.postId !== r.postId);
  adminMarked.value = reportList.value.length ? reportList.value[0] : null;
  ElMessage.success("已删除并通过审核");
}

/* ---------- 菜单切换 ---------- */
function onFeedbackClick() {
  activeMenu.value = "feedback";
  loadFeedback();
}
function onOrdersClick() {
  activeMenu.value = "orders";
  loadOrders();
}
function onPostsClick() {
  activeMenu.value = "posts";
  loadAllPosts();
}
function onAuditClick() {
  activeMenu.value = "audit";
  loadAudit();
}

onMounted(() => onFeedbackClick());
</script>

<style scoped>
/* 与原来完全一致，已包含 admin-marked 边框色 */
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
  background: #f5f5f5;
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
  gap: 10px;
}
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
.action-btn.danger {
  background: #e53935;
}
.action-btn.danger:hover {
  background: #c62828;
}
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
.response {
  margin-top: 10px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}
.gallery-img {
  width: 100%;
  border-radius: 6px;
}

/* 被管理员标记的帖子左侧边框高亮 */
.admin-marked {
  border-left: 4px solid #f56c6c;
}
</style>
