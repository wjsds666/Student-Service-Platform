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
      <div class="card">
        <p><strong>姓名：</strong>张三</p>
        <p><strong>学院：</strong>计算机学院</p>
        <p><strong>专业：</strong>软件工程</p>
        <p><strong>班级：</strong>软工2022级3班</p>
        <p><strong>手机：</strong>13800138000</p>
        <p><strong>邮箱：</strong>zhangsan@mail.com</p>
      </div>
    </div>

    <!-- 2. 我的反馈 -->
    <div v-if="activeMenu === 'mine'" class="content-panel">
      <h2>我的反馈</h2>
      <div
        class="card"
        v-for="f in fakeFeedbacks"
        :key="f.postId"
        @click="openDetail(f)"
      >
        <div class="card-header">{{ f.title }}</div>
        <div class="card-body">{{ f.content }}</div>
        <div class="card-footer">
          <el-tag :type="f.level === 1 ? 'danger' : 'info'">
            {{ f.level === 1 ? '紧急' : '普通' }}
          </el-tag>
          <span style="margin-left: auto">提交于 {{ f.createTime }}</span>
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
          <el-form-item label="紧急">
            <el-switch v-model="form.level" :active-value="1" :inactive-value="2" />
          </el-form-item>
          <el-form-item label="匿名">
            <el-switch v-model="form.hide" :active-value="1" :inactive-value="2" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitFake">提交</el-button>
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
      <p class="meta">紧急：
        <el-tag :type="detail.level === 1 ? 'danger' : 'info'">
          {{ detail.level === 1 ? '紧急' : '普通' }}
        </el-tag>
      </p>
      <p class="content">{{ detail.content }}</p>
      <p v-if="detail.response" class="response">管理员回复：{{ detail.response }}</p>
    </div>
    <template #footer>
      <el-button @click="showDlg = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

/* ===== 菜单 ===== */
const activeMenu = ref('profile')
function switchMenu(key) {
  activeMenu.value = key
}

/* ===== 假数据 ===== */
const fakeFeedbacks = ref([
  {
    postId: 1,
    title: '宿舍灯坏了',
    content: 'A5-203 房顶灯管不亮，请尽快维修，谢谢！',
    level: 1,
    createTime: '2025-06-20 09:30',
    response: '已安排师傅，今晚 7 点到场。'
  },
  {
    postId: 2,
    title: '图书馆空调太冷',
    content: '三楼自习室空调温度过低，能否调高一点？',
    level: 2,
    createTime: '2025-06-19 16:00',
    response: null
  }
])

/* ===== 提交反馈假表单 ===== */
const form = ref({
  title: '',
  content: '',
  level: 2,
  hide: 2
})
function submitFake() {
  if (!form.value.title || !form.value.content) {
    ElMessage.warning('请填完整')
    return
  }
  // 假装提交成功
  ElMessage.success('提交成功（Mock）')
  form.value.title = ''
  form.value.content = ''
}

/* ===== 弹窗 ===== */
const showDlg = ref(false)
const detail = ref({})
function openDetail(item) {
  detail.value = item
  showDlg.value = true
}
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
  box-shadow: 0 4px 6px rgba(0,0,0,.1), 0 10px 15px rgba(0,0,0,.2);
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
  transition: background-color .3s;
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
  box-shadow: 0 2px 10px rgba(0,0,0,.05);
  cursor: pointer;
  transition: box-shadow .2s;
}
.card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,.1);
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
</style>