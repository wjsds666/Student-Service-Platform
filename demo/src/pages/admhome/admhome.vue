<template>
  <div class="top-bar">
    <div class="platform-name">管理员中心</div>
  </div>

  <div class="menu-bar">
    <div class="menu-item" :class="{ active: activeMenu === 'feedback' }" @click="onFeedbackClick">查看反馈</div>
    <div class="menu-item" :class="{ active: activeMenu === 'orders' }" @click="onOrdersClick">我的接单</div>
  </div>

  <div class="content-container">
    <!-- 待处理反馈 -->
    <div v-if="activeMenu === 'feedback'" class="content-panel">
      <h2>待处理反馈</h2>
      <div v-loading="loading" element-loading-text="加载中...">
        <div class="card" v-for="p in feedbackPosts" :key="p.postId" @click="openDetail(p)">
          <div class="card-header">{{ p.title }}</div>
          <div class="card-body">{{ p.content }}</div>
          <div class="card-footer">
            <button class="action-btn" @click.stop="handleClaim(p)">接单</button>
            <button class="action-btn" @click.stop="handleReply(p)">回复</button>
            <button class="action-btn" @click.stop="handleReport(p)">标记</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的接单 -->
    <div v-if="activeMenu === 'orders'" class="content-panel">
      <h2>我的接单</h2>
      <div v-loading="loading" element-loading-text="加载中...">
        <div class="card" v-for="p in orderPosts" :key="p.postId" @click="openDetail(p)">
          <div class="card-header">{{ p.title }}</div>
          <div class="card-body">{{ p.content }}</div>
          <div class="card-footer">
            <button class="action-btn" @click.stop="handleComplete(p)">完成</button>
            <button class="action-btn" @click.stop="handleReply(p)">回复</button>
            <button class="action-btn" @click.stop="handleReport(p)">标记</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 大图弹窗 -->
  <el-dialog v-model="showDlg" title="反馈详情" width="700px" center>
    <el-carousel v-if="detail.picUrls?.length" height="400px" indicator-position="outside">
      <el-carousel-item v-for="(url, idx) in detail.picUrls" :key="idx">
        <el-image :src="url" :preview-src-list="detail.picUrls" fit="contain" class="gallery-img" />
      </el-carousel-item>
    </el-carousel>

    <div class="detail-info">
      <h3>{{ detail.title }}</h3>
      <p class="meta">提交时间：{{ detail.createTime }}</p>
      <p class="meta">紧急程度：
        <el-tag :type="detail.level === 1 ? 'danger' : 'info'">{{ detail.level === 1 ? '紧急' : '普通' }}</el-tag>
      </p>
      <p class="content">{{ detail.content }}</p>
      <p v-if="detail.response" class="response">管理员回复：{{ detail.response }}</p>
    </div>

    <template #footer>
      <el-button @click="showDlg = false">关闭</el-button>
      <el-button type="primary" @click="handleClaim(detail)" v-if="activeMenu === 'feedback'">接单</el-button>
      <el-button type="primary" @click="handleReply(detail)">回复</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { apiReportPost } from '@/api/report'
import { apiGetAllPosts,
         apiSelectOrders,
         apiAcceptPost,
         apiReplyPost} from '@/api/post'

const userStore = useUserStore()
const activeMenu = ref('feedback')
const showDlg = ref(false)
const detail = ref({})
const loading = ref(false)

/* ===== 数据 ===== */
const feedbackPosts = ref([])
const orderPosts = ref([])
const auditPosts = ref([])

/* ===== 拉取函数 ===== */
async function loadFeedback() {
  loading.value = true
  try {
    const { data } = await apiGetAllPosts({ state: 1 }) // 未接单
    feedbackPosts.value = data
  } finally { loading.value = false }
}

async function loadOrders() {
  loading.value = true
  try {
    const { data } = await apiSelectOrders({ state: 2 }) // 已接单
    orderPosts.value = data
  } finally { loading.value = false }
}

/* ===== 弹窗（不复用 /post，直接复用列表数据） ===== */
function openDetail(post) {
  // 直接用已有数据，不调 /post 详情接口
  detail.value = post
  showDlg.value = true
}

/* ===== 按钮事件（对接真实 Mock） ===== */
async function handleClaim(post) {
  try {
    await apiAcceptPost({ userId: userStore.userId, postId: post.postId })
    ElMessage.success('接单成功')
    // 可选刷新当前列表
    if (activeMenu.value === 'feedback') loadFeedback()
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || '接单失败')
  }
}

async function handleReply(post) {
  try {
    await apiReplyPost({ userId: userStore.userId, postId: post.postId, response: '已处理' })
    ElMessage.success('回复成功')
    if (activeMenu.value === 'feedback') loadFeedback()
    if (activeMenu.value === 'orders') loadOrders()
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || '回复失败')
  }
}
async function handleReport(post) {
  try {
    await apiReportPost({ userId: userStore.userId, postId: post.postId, reason: '用户标记为垃圾' })
    ElMessage.success('标记成功')
    // 刷新当前列表
    if (activeMenu.value === 'feedback') loadFeedback()
    if (activeMenu.value === 'orders') loadOrders()
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || '标记失败')
  }
}

function handleComplete(post) { ElMessage.success('已完成') }
/* ===== 菜单切换 ===== */
function onFeedbackClick() {
  activeMenu.value = 'feedback'
  loadFeedback()
}
function onOrdersClick() {
  activeMenu.value = 'orders'
  loadOrders()
}
onMounted(() => {
  onFeedbackClick()
  // 调完我的接单后打印
  setTimeout(() => {
    console.log('返回原始 data:', orderPosts.value)
  }, 500)
})
onMounted(() => {
  onFeedbackClick() // 首次自动拉一次
}
)
</script>
<style scoped>
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
</style>