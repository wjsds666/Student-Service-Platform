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
            <button class="action-btn success" @click.stop="handleFinish(p)">结束</button>
          </div>
        </div>
      </div>
    </div>
      

    <!-- 详情弹窗：只保留一次内容 -->
    <el-dialog v-model="showDlg" title="详情" width="700px" center>
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

<script setup lang="ts">
import './admhome.css'
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import {
  apiGetAllPosts,
  apiSelectOrders,
  apiAcceptPost,
  apiReplyPost,
  apiFinishOrder
} from '@/api/post'
import { apiReportPost, apiRevokeOrder } from '@/api/report'

/* 基础 */
const userStore = useUserStore()
const activeMenu = ref<'feedback' | 'orders'>('feedback')

/* 数据 */
const feedbackPosts = ref<any[]>([])
const orderPosts   = ref<any[]>([])
const loading      = ref(false)

/* 加载 */
async function loadFeedback() {
  loading.value = true
  try {
    const res = await apiGetAllPosts({ state: 1, userId: userStore.userId })
    feedbackPosts.value = res.data ?? []
  } finally {
    loading.value = false
  }
}
async function loadOrders() {
  loading.value = true
  try {
    const res = await apiSelectOrders({ userId: userStore.userId, state: 2 })
    orderPosts.value = res.data ?? []
  } finally {
    loading.value = false
  }
}

/* 接单 */
async function handleClaim(post: any) {
  try {
    const { data } = await apiAcceptPost(post.postId, userStore.userId)

    if (data.code === 200) {
      ElMessage.success('接单成功')
      loadFeedback()
    } else {
      ElMessage.error(data.msg || '接单失败')
    }
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.msg || '网络错误')
  }
}

/* 撤销 */
async function handleRevoke(post: any) {
  try {
    await apiRevokeOrder(userStore.userId, post.postId)
    ElMessage.success('已撤销接单')
    loadOrders()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.msg || '撤销失败')
  }
}

/* 完成 */
async function handleFinish(post: any) {
  try {
    await apiFinishOrder(post.acceptanceId)
    ElMessage.success('该反馈已标记为完成')
    loadOrders()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.msg || '结束失败')
  }
}

/* 回复 */
const showReplyDlg = ref(false)
const replyText = ref('')
let currentReplyPost: any = null
function openReplyDlg(post: any) {
  currentReplyPost = post
  replyText.value = ''
  showReplyDlg.value = true
}
async function submitReply() {
  if (!replyText.value.trim()) return ElMessage.warning('请输入回复内容')
  try {
    await apiReplyPost({
      userId: userStore.userId,
      postId: currentReplyPost.postId,
      content: replyText.value
    })
    ElMessage.success('回复成功')
    showReplyDlg.value = false
    loadOrders()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.msg || '回复失败')
  }
}

/* 举报 */
const showReportDlg = ref(false)
const reportText = ref('')
let currentReportPost: any = null
function openReportDlg(post: any) {
  currentReportPost = post
  reportText.value = ''
  showReportDlg.value = true
}
async function submitReport() {
  if (!reportText.value.trim()) return ElMessage.warning('请填写举报理由')
  try {
    await apiReportPost(userStore.userId, currentReportPost.postId, reportText.value.trim())
    ElMessage.success('举报提交成功，等待超级管理员审核')
    showReportDlg.value = false
    loadFeedback()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.msg || '举报失败')
  }
}

/* 详情弹窗 */
const showDlg = ref(false)
const detail = ref<any>({})
const displayName = computed(() =>
  detail.value.hide === 1 ? '***' : (detail.value.userName || '未知用户')
)
const showAvatar = computed(() => detail.value.hide !== 1 && detail.value.picture)
function openDetail(post: any) {
  detail.value = post
  showDlg.value = true
}

/* 菜单切换 */
function onFeedbackClick() {
  activeMenu.value = 'feedback'
  loadFeedback()
}
function onOrdersClick() {
  activeMenu.value = 'orders'
  loadOrders()
}

onMounted(() => onFeedbackClick())
</script>