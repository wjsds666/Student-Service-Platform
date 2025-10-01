<template>
  <div class="top-bar">
    <div class="platform-name">管理员中心</div>
  </div>

  <!-- 左侧菜单 -->
  <div class="menu-bar">
    <div class="menu-item" :class="{ active: activeMenu === 'feedback' }" @click="onFeedbackClick">查看反馈</div>
    <div class="menu-item" :class="{ active: activeMenu === 'orders' }" @click="onOrdersClick">我的接单</div>
  </div>

  <!-- 右侧内容区 -->
  <div class="content-container">
    <!-- 1. 查看反馈 -->
    <div v-if="activeMenu === 'feedback'" class="content-panel">
      <h2>待处理反馈</h2>
      <div v-loading="loading" element-loading-text="加载中...">
        <div class="card" v-for="p in feedbackPosts" :key="p.postId" @click="openDetail(p)">
          <div class="card-header">{{ p.title }}</div>
          <div class="card-body">{{ p.content }}</div>
          <div class="card-footer">
            <button class="action-btn" @click.stop="handleClaim(p)">接单</button>
            <button class="action-btn" @click.stop="openReportDlg(p)">标记</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 我的接单 -->
    <div v-if="activeMenu === 'orders'" class="content-panel">
      <h2>我的接单</h2>
      <div v-loading="loading" element-loading-text="加载中...">
        <div class="card" v-for="p in orderPosts" :key="p.postId" @click="openDetail(p)">
          <div class="card-header">{{ p.title }}</div>
          <div class="card-body">{{ p.content }}</div>
          <div class="card-footer">
            <button class="action-btn" @click.stop="openReplyDlg(p)">回复</button>
            <button class="action-btn danger" @click.stop="handleRevoke(p)">撤销</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗：只保留一次内容 -->
    <el-dialog v-model="showDlg" title="详情" width="700px" center :before-close="handleClose">
<el-carousel v-if="detail.image?.length" height="400px" indicator-position="outside">
  <el-carousel-item v-for="(url, idx) in detail.image" :key="idx">
    <el-image :src="url" :preview-src-list="detail.image" fit="contain" class="gallery-img" />
  </el-carousel-item>
</el-carousel>

      <div class="detail-info">
        <!-- 用户区域：匿名星号 + 头像 -->
        <div class="user-line">
          <el-avatar v-if="showAvatar" :src="detail.picture" size="small" class="avatar" />
          <span class="user-name">{{ displayName }}</span>
        </div>

        <h3>{{ detail.title }}</h3>
        <p class="meta">提交时间：{{ detail.createTime }}</p>
        <p class="meta">
          紧急程度：
          <el-tag :type="detail.level === 1 ? 'danger' : 'info'">
            {{ detail.level === 1 ? "紧急" : "普通" }}
          </el-tag>
        </p>
        <p class="content">{{ detail.content }}</p>
        <p v-if="detail.response" class="response">管理员回复：{{ detail.response }}</p>
      </div>

      <template #footer>
        <el-button @click="showDlg = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 回复弹窗 -->
    <el-dialog v-model="showReplyDlg" title="回复反馈" width="500px" @closed="replyText = ''">
      <el-input v-model="replyText" type="textarea" :rows="4" placeholder="请输入回复内容" />
      <template #footer>
        <el-button @click="showReplyDlg = false">取消</el-button>
        <el-button type="primary" @click="submitReply">发送</el-button>
      </template>
    </el-dialog>

    <!-- 标记弹窗 -->
    <el-dialog v-model="showReportDlg" title="举报反馈" width="500px" @closed="reportText = ''">
      <el-input v-model="reportText" type="textarea" :rows="4" placeholder="请填写举报理由" />
      <template #footer>
        <el-button @click="showReportDlg = false">取消</el-button>
        <el-button type="primary" @click="submitReport">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import './admhome.css'
import { ref, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { apiReportPost } from "@/api/report";
import {
  apiGetAllPosts,
  apiSelectOrders,
  apiAcceptPost,
  apiReplyPost,
} from "@/api/post";
import request from "@/utils/request";

const userStore = useUserStore();
const activeMenu = ref("feedback");
const showDlg = ref(false);
const showReplyDlg = ref(false);
const showReportDlg = ref(false);
const detail = ref({});
const loading = ref(false);

/* 数据 */
const feedbackPosts = ref([]);
const orderPosts = ref([]);
const replyText = ref("");
const reportText = ref("");
let currentReplyPost = null;
let currentReportPost = null;

/* 用户展示（匿名星号 + 头像） */
const displayName = computed(() =>
  (!detail.value.hide || detail.value.hide === 1) ? '***' : (detail.value.userName || '未知用户')
);
const showAvatar = computed(() =>
  detail.value.hide !== 1 && detail.value.picture
);

/* 拉取函数 */
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

/* 弹窗 */
function openDetail(post) {
  detail.value = post;
  showDlg.value = true;
}
function handleClose() {
  // 什么都不做，直接关闭
}
function openReplyDlg(post) {
  currentReplyPost = post;
  showReplyDlg.value = true;
}
function openReportDlg(post) {
  currentReportPost = post;
  showReportDlg.value = true;
}

/* 按钮事件 */
async function handleClaim(post) {
  try {
    await apiAcceptPost({ userId: userStore.userId, postId: post.postId });
    ElMessage.success("接单成功");
    loadFeedback();
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || "接单失败");
  }
}
async function handleRevoke(post) {
  try {
    await request.put("/api/user/admin/delete_accept", null, {
      params: { userId: userStore.userId, postId: post.postId },
    });
    ElMessage.success("已撤销接单");
    loadOrders();
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || "撤销失败");
  }
}
async function submitReply() {
  if (!replyText.value.trim()) {
    ElMessage.warning("请输入回复内容");
    return;
  }
  try {
    await apiReplyPost({
      userId: userStore.userId,
      postId: currentReplyPost.postId,
      response: replyText.value,
    });
    ElMessage.success("回复成功");
    showReplyDlg.value = false;
    loadOrders();
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || "回复失败");
  }
}
async function submitReport() {
  if (!reportText.value.trim()) {
    ElMessage.warning("请填写举报理由");
    return;
  }
  try {
    await apiReportPost({
      userId: userStore.userId,
      postId: currentReportPost.postId,
      reason: reportText.value.trim(),
    });
    ElMessage.success("举报提交成功，等待超级管理员审核");
    showReportDlg.value = false;
    if (activeMenu.value === "feedback") loadFeedback();
    if (activeMenu.value === "orders") loadOrders();
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || "举报失败");
  }
}

/* 菜单切换 */
function onFeedbackClick() {
  activeMenu.value = "feedback";
  loadFeedback();
}
function onOrdersClick() {
  activeMenu.value = "orders";
  loadOrders();
}

onMounted(() => onFeedbackClick());
</script>