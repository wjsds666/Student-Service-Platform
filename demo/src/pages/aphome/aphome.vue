<template>
  <!-- 顶部条 -->
  <div class="top-bar">
    <div class="platform-name">超级管理员中心</div>
  </div>

  <!-- 左侧菜单 -->
  <div class="menu-bar">
    <div
      class="menu-item"
      :class="{ active: activeMenu === 'posts' }"
      @click="switchMenu('posts')"
    >
      所有帖子
    </div>
    <div
      class="menu-item"
      :class="{ active: activeMenu === 'audit' }"
      @click="switchMenu('audit')"
    >
      垃圾审核
    </div>
  </div>

  <!-- 右侧内容区 -->
  <div class="content-container">
    <!-- 1. 所有帖子（超管可一键删除） -->
    <div v-if="activeMenu === 'posts'" class="content-panel">
      <h2>所有帖子</h2>
      <div v-loading="loading" element-loading-text="加载中...">
        <div class="card" v-for="p in allPosts" :key="p.postId">
          <div class="card-header">{{ p.title }}</div>
          <div class="card-body">{{ p.content }}</div>
          <div class="card-footer">
            <button class="action-btn" @click="handleDelete(p)">删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 垃圾审核（删除 / 驳回） -->
    <div v-if="activeMenu === 'audit'" class="content-panel">
      <h2>垃圾信息审核</h2>
      <div v-loading="loading" element-loading-text="加载中...">
        <div class="card" v-for="r in reportList" :key="r.postId">
          <div class="card-header">{{ r.title }}</div>
          <div class="card-body">
            <p><strong>举报理由：</strong>{{ r.reason }}</p>
            <p><strong>提交人：</strong>{{ r.reporter }}</p>
          </div>
          <div class="card-footer">
            <button class="action-btn" @click="handleAuditReject(r)">驳回</button>
            <button class="action-btn danger" @click="handleAuditDelete(r)">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 大图弹窗（复用 admhome 样式） -->
  <el-dialog v-model="showDlg" title="详情" width="700px" center>
    <div class="detail-info">
      <h3>{{ detail.title }}</h3>
      <p class="meta">提交时间：{{ detail.createTime }}</p>
      <p class="meta">
        紧急：
        <el-tag :type="detail.level === 1 ? 'danger' : 'info'">
          {{ detail.level === 1 ? '紧急' : '普通' }}
        </el-tag>
      </p>
      <p class="content">{{ detail.content }}</p>
      <p v-if="detail.response" class="response">管理员回复：{{ detail.response }}</p>
    </div>
    <template #footer">
      <el-button @click="showDlg = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const activeMenu = ref('posts')
const loading = ref(false)
const showDlg = ref(false)
const detail = ref({})

/* ===== 死数据 ===== */
const allPosts = ref([
  { postId: 1, title: '宿舍灯坏了', content: 'A5-203 灯不亮', level: 1, createTime: '2025-06-20 09:30', response: null },
  { postId: 2, title: '空调太冷', content: '三楼空调温度低', level: 2, createTime: '2025-06-19 16:00', response: null }
])

const reportList = ref([
  { postId: 3, title: '垃圾广告', reason: '内容无效', reporter: '学生A' },
  { postId: 4, title: '重复提交', reason: '恶意刷屏', reporter: '学生B' }
])

/* ===== 菜单切换 ===== */
function switchMenu(key) {
  activeMenu.value = key
  loading.value = true
  setTimeout(() => { loading.value = false }, 300) // 模拟加载
}

/* ===== 超管操作（死模板） ===== */
async function handleDelete(post) {
  ElMessage.success('已删除（模板）')
  allPosts.value = allPosts.value.filter(p => p.postId !== post.postId)
}

async function handleAuditReject(report) {
  ElMessage.success('已驳回（模板）')
  reportList.value = reportList.value.filter(r => r.postId !== report.postId)
}

async function handleAuditDelete(report) {
  ElMessage.success('已删除并通过审核（模板）')
  reportList.value = reportList.value.filter(r => r.postId !== report.postId)
}

function openDetail(post) {
  detail.value = post
  showDlg.value = true
}

onMounted(() => {
  switchMenu('posts')
})
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
</style>
