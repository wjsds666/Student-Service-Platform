<template>
  <!-- 顶部条 -->
  <div class="top-bar">
    <div class="platform-name">超级管理员中心</div>
  </div>

  <!-- 左侧菜单 -->
  <div class="menu-bar">
    <div class="menu-item" :class="{ active: activeMenu === 'feedback' }" @click="onFeedbackClick">查看反馈</div>
    <div class="menu-item" :class="{ active: activeMenu === 'orders' }" @click="onOrdersClick">我的接单</div>
    <div class="menu-item" :class="{ active: activeMenu === 'audit' }" @click="onAuditClick">审核标记</div>
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
            <button class="action-btn danger" @click.stop="handleDelete(p)">删除</button>
          </div>
        </div>
      </div>
    </div>

<!-- 2. 我的接单：增加撤单/结束按钮 -->
<div v-if="activeMenu === 'orders'" class="content-panel">
  <h2>我的接单</h2>
  <div v-loading="loading" element-loading-text="加载中...">
    <div class="card" v-for="p in orderPosts" :key="p.postId" @click="openDetail(p)">
      <div class="card-header">{{ p.title }}</div>
      <div class="card-body">{{ p.content }}</div>
      <div class="card-footer">
        <button class="action-btn" @click.stop="openReplyDlg(p)">回复</button>
        <button class="action-btn danger" @click.stop="handleRevoke(p)">撤单</button>
        <!-- ✅ 新增结束接单 -->
        <button class="action-btn success" @click.stop="handleFinish(p)">结束</button>
      </div>
    </div>
  </div>
</div>

    <!-- 3. 审核标记：卡片列表 + 大图详情弹窗 -->
    <div v-if="activeMenu === 'audit'" class="content-panel">
      <h2>审核标记列表</h2>
      <div v-loading="loading" element-loading-text="加载中...">
        <div v-if="reportList.length === 0" style="text-align:center;color:#999;margin-top:40px;">暂无举报记录</div>

        <!-- 卡片列表：同查看反馈样式 -->
        <div
          class="card"
          v-for="r in reportList"
          :key="r.postId"
          @click="openAuditDetail(r)"
        >
          <div class="card-header">{{ r.title }}</div>
          <div class="card-body">{{ r.content }}</div>
          <div class="card-footer">
            <span style="margin-left: auto; font-size: 13px; color: #666">举报于 {{ r.createTime }}</span>
          </div>
          <div class="card-footer" style="margin-top: 10px">
            <button class="action-btn" @click.stop="handleAuditReject(r)">驳回</button>
            <button class="action-btn danger" @click.stop="handleAuditDelete(r)">删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗：查看反馈 / 我的接单 -->
    <el-dialog v-model="showDlg" title="详情" width="700px" center>
<el-carousel v-if="detail.image?.length" height="400px" indicator-position="outside">
  <el-carousel-item v-for="(url, idx) in detail.image" :key="idx">
    <el-image :src="url" :preview-src-list="detail.image" fit="contain" class="gallery-img" />
  </el-carousel-item>
</el-carousel>

      <div class="detail-info">
        <!-- 用户区域：匿名星号 + 头像（后端字段 picture） -->
        <div class="user-line">
          <el-avatar
            v-if="showAvatar"
            :src="detail.picture"
            size="small"
            class="avatar"
          />
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
        <p v-if="detail.response" class="response">
          管理员回复：{{ detail.response }}
        </p>
      </div>

      <template #footer">
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

    <!-- 审核详情弹窗：大图 -->
    <el-dialog v-model="showAuditDlg" title="举报详情" width="700px" center>
      <div class="detail-info">

        <!-- 帖子图片：后端字段 image + 点击大图预览 -->
        <el-carousel v-if="auditDetail.image?.length" height="400px" indicator-position="outside">
  <el-carousel-item v-for="(url, idx) in auditDetail.image" :key="idx">
    <el-image :src="url" :preview-src-list="auditDetail.image" fit="contain" class="gallery-img" />
  </el-carousel-item>
</el-carousel>

        <h3>{{ auditDetail.title }}</h3>
        <p class="meta">提交时间：{{ auditDetail.createTime }}</p>
        <p class="content">{{ auditDetail.content }}</p>

        <!-- 举报理由（如有） -->
        <p v-if="auditDetail.reason" class="meta">
          <strong>举报理由：</strong>{{ auditDetail.reason }}
        </p>

      </div>
      <template #footer>
        <div style="text-align: center">
          <el-button @click="showAuditDlg = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import './aphome.css'
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
import {
  apiGetReportsForAudit,
  apiAuditReport,
  apiDeletePostBySuper,
  apiRevokeOrder
} from '@/api/report'

const userStore = useUserStore()
const activeMenu = ref('feedback')

/* 数据 */
const feedbackPosts = ref<any[]>([])
const orderPosts = ref<any[]>([])
const reportList = ref<any[]>([])
const loading = ref(false)

async function handleDelete(post: any) {
  try {
    await apiDeletePostBySuper(post.postId)
    ElMessage.success('已删除')
    loadFeedback()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.msg || '删除失败')
  }
}
async function loadFeedback() {
  loading.value = true
  try {
    const res = await apiGetAllPosts({ state: 1 })
    feedbackPosts.value = res.data || res || []
  } finally {
    loading.value = false
  }
}
async function loadOrders() {
  loading.value = true
  try {
    const res = await apiSelectOrders({ userId: userStore.userId, state: 2 })
    orderPosts.value = res.data || res || []
  } finally {
    loading.value = false
  }
}
async function loadAudit() {
  loading.value = true
  try {
    const res = await apiGetReportsForAudit()
    reportList.value = res.data || res || []
  } finally {
    loading.value = false
  }
}

/* 接单 / 撤单 / 删帖 / 审核 */
async function handleClaim(post: any) {
  try {
    await apiAcceptPost({ userId: userStore.userId, postId: post.postId })
    ElMessage.success('接单成功')
    loadFeedback()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.msg || '接单失败')
  }
}
async function handleRevoke(post: any) {
  try {
    await apiRevokeOrder(userStore.userId, post.postId)
    ElMessage.success('已撤单')
    loadOrders()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.msg || '撤单失败')
  }
}
async function handleFinish(post: any) {
  try {
    await apiFinishOrder(post.postId)
    ElMessage.success('该反馈已标记为完成')
    loadOrders()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.msg || '结束失败')
  }
}
async function handleAuditReject(r: any) {
  try {
    await apiAuditReport(userStore.userId, r.reportId, 2)
    ElMessage.success('已驳回')
    reportList.value = reportList.value.filter(x => x.reportId !== r.reportId)
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.msg || '驳回失败')
  }
}
async function handleAuditDelete(r: any) {
  try {
    await apiAuditReport(userStore.userId, r.reportId, 1)
    ElMessage.success('已删除并通过审核')
    reportList.value = reportList.value.filter(x => x.reportId !== r.reportId)
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.msg || '删除失败')
  }
}

/* 用户展示（匿名星号 + 头像） */
const displayName = computed(() =>
  (!detail.value.hide || detail.value.hide === 1) ? '***' : (detail.value.userName || '未知用户')
)

const showAvatar = computed(() =>
  detail.value.hide !== 1 && detail.value.picture
)

/* 回复 */
const showReplyDlg = ref(false)
const replyText = ref('')
let currentReplyPost = null as any
function openReplyDlg(post: any) {
  currentReplyPost = post
  replyText.value = ''
  showReplyDlg.value = true
}
async function submitReply() {
  if (!replyText.value.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }
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

/* 弹窗 */
const showDlg = ref(false)
const showAuditDlg = ref(false)
const detail = ref<any>({})
const auditDetail = ref<any>({})
function openDetail(post: any) {
  detail.value = post
  showDlg.value = true
}
function openAuditDetail(r: any) {
  auditDetail.value = r
  showAuditDlg.value = true
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
function onAuditClick() {
  activeMenu.value = 'audit'
  loadAudit()
}

onMounted(() => onFeedbackClick())
</script>