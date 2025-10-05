<template>
  <!-- 顶部条 -->
  <div class="top-bar">
    <div class="platform-name">学生服务平台</div>
  </div>

  <!-- 左侧菜单 -->
  <div class="menu-bar">
    <div class="menu-item" :class="{ active: activeMenu === 'profile' }" @click="switchMenu('profile')">个人信息</div>
    <div class="menu-item" :class="{ active: activeMenu === 'mine' }" @click="switchMenu('mine')">我的反馈</div>
    <div class="menu-item" :class="{ active: activeMenu === 'new' }" @click="switchMenu('new')">提交反馈</div>
  </div>

  <!-- 右侧内容区 -->
  <div class="content-container">
    <!-- 1. 个人信息 -->
    <div v-if="activeMenu === 'profile'" class="content-panel">
      <h2>个人信息</h2>
      <div class="card" style="display:flex;align-items:flex-start;gap:24px">
        <!-- 头像 -->
        <div class="avatar-box">
          <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="onAvatarChange" />
          <div class="avatar-circle" @click="triggerAvatarSelect">
            <img v-if="avatarUrl" :src="avatarUrl" class="avatar-img" />
            <div v-else class="avatar-placeholder">点击添加头像</div>
          </div>
        </div>

        <!-- 表单 -->
        <el-form label-width="80px" style="flex:1">
          <el-form-item label="姓名"><el-input v-model="profile.name" placeholder="请输入姓名" /></el-form-item>
          <el-form-item label="学院"><el-input v-model="profile.college" placeholder="请输入学院" /></el-form-item>
          <el-form-item label="专业"><el-input v-model="profile.major" placeholder="请输入专业" /></el-form-item>
          <el-form-item label="班级"><el-input v-model="profile.class" placeholder="请输入班级" /></el-form-item>
          <el-form-item label="手机"><el-input v-model="profile.phone" placeholder="请输入手机" /></el-form-item>
          <el-form-item label="邮箱"><el-input v-model="profile.email" placeholder="请输入邮箱" /></el-form-item>
          <el-form-item label="">
            <div style="width:100%;display:flex;justify-content:center">
              <el-button type="primary" :loading="saveLoading" @click="handleSave">保存</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 2. 我的反馈 -->
    <div v-if="activeMenu === 'mine'" class="content-panel">
      <h2>我的反馈</h2>
      <div v-loading="loading" element-loading-text="加载中...">
        <div v-for="f in feedbacks" :key="f.postId" class="card" @click="openView(f)">
          <div class="card-header">
            {{ f.title }}
            <!-- 通知铃铛 -->
            <el-badge :value="f.noticeCount" :hidden="!f.noticeCount" class="notice-badge">
              <el-icon class="bell-icon" @click.stop="openNotice(f)"><Bell /></el-icon>
            </el-badge>
          </div>
          <div class="card-body">{{ f.content }}</div>
          <div class="card-footer">
            <el-tag :type="f.level === 1 ? 'danger' : 'info'">{{ f.level === 1 ? "紧急" : "普通" }}</el-tag>
            <span style="margin-left:auto;font-size:13px;color:#666">提交于 {{ f.createTime }}</span>
          </div>
          <div class="card-footer" style="margin-top:10px">
            <button class="action-btn" @click.stop="openView(f)">查看</button>
            <button class="action-btn" @click.stop="openReply(f)">评价</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 提交反馈 -->
    <div v-if="activeMenu === 'new'" class="content-panel">
      <h2>提交新反馈</h2>
      <div class="card">
        <el-form label-width="80px">
          <el-form-item label="标题"><el-input v-model="form.title" placeholder="给问题起个标题" /></el-form-item>
          <el-form-item label="内容">
            <el-input type="textarea" :rows="4" v-model="form.content" placeholder="详细描述问题" />
          </el-form-item>
          <el-form-item label="图片">
            <div class="img-add-wrapper">
              <div v-if="picFiles.length < 3" class="img-box" @click="triggerPicSelect">
                <span class="plus">+</span>
              </div>
              <input ref="picInput" type="file" accept="image/*" style="display:none" @change="onPicChange" />
              <div v-for="(f, idx) in picFiles" :key="idx" class="img-preview">
                <img :src="f.url" />
                <span class="close" @click.stop="removePic(idx)">×</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="紧急"><el-switch v-model="form.level" :active-value="1" :inactive-value="2" /></el-form-item>
          <el-form-item label="匿名"><el-switch v-model="form.hide" :active-value="1" :inactive-value="2" /></el-form-item>
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
        <el-tag :type="viewPost.level === 1 ? 'danger' : 'info'">{{ viewPost.level === 1 ? "紧急" : "普通" }}</el-tag>
      </p>
      <p class="content">{{ viewPost.content }}</p>
      <div class="response-box">
        <div class="response-title">管理员回复</div>
        <div class="response-content">{{ viewPost.response || "管理员还未回复，请耐心等待" }}</div>
      </div>
    </div>
    <template #footer>
      <div style="text-align:center"><el-button @click="showViewDlg = false">关闭</el-button></div>
    </template>
  </el-dialog>

  <!-- 评价弹窗 -->
  <el-dialog v-model="showReplyDlg" title="我要评价" width="500px" center>
    <div style="margin-bottom:12px">
      <span style="margin-right:8px">满意度：</span>
      <el-rate v-model="replyStar" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" show-score score-template="{value} 分" />
    </div>
    <el-input v-model="replyText" type="textarea" :rows="4" placeholder="请输入文字评价（选填）" />
    <template #footer>
      <div style="text-align:center">
        <el-button type="primary" @click="submitReply">提交</el-button>
        <el-button @click="showReplyDlg = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 系统通知弹窗 -->
  <el-dialog v-model="showNoticeDlg" title="系统通知" width="480px" center>
    <div v-if="noticeList.length">
      <div v-for="n in noticeList" :key="n.id" class="notice-item">
        <div class="notice-time">{{ n.createTime }}</div>
        <div class="notice-content">{{ n.content }}</div>
      </div>
    </div>
    <div v-else style="text-align:center;color:#999">暂无通知</div>
    <template #footer>
      <el-button @click="showNoticeDlg = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import './stuhome.css'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import {
  apiGetMyPosts,
  apiSubmitPost,
  apiComment,
  apiUploadPostImage
} from '@/api/post'
import { apiUpdateProfile, apiUploadAvatar } from '@/api/user'
import { apiGetNotice } from '@/api/notice'
import { Bell } from '@element-plus/icons-vue'

const userStore = useUserStore()
const activeMenu = ref('profile')

/* ---------- 通知 ---------- */
const showNoticeDlg = ref(false)
const noticeList = ref([])
async function openNotice(post: any) {
  const res = await apiGetNotice()
  noticeList.value = (res.data || res || []).map((i: any) => ({
    id: i.postId,
    content: i.message,
    createTime: i.createTime
  }))
  showNoticeDlg.value = true
}

/* ---------- 头像 ---------- */
const avatarUrl = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
async function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  const maxSize = 2 * 1024 * 1024 // 2MB
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('请上传图片文件（JPEG/PNG/GIF）')
    return
  }
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过2MB')
    return
  }
  try {
    avatarUrl.value = URL.createObjectURL(file)
    const { data } = await apiUploadAvatar(file, userStore.userId)
    avatarUrl.value = data.avatarUrl
    ElMessage.success('头像更新成功')
  } catch (err: any) {
    ElMessage.error(err?.response?.data?.msg || '头像上传失败')
    avatarUrl.value = ''
  } finally {
    ;(e.target as HTMLInputElement).value = ''
  }
}

/* ---------- 个人信息 ---------- */
const profile = ref({
  name: '',
  college: '',
  major: '',
  class: '',
  phone: '',
  email: ''
})
const saveLoading = ref(false)
async function handleSave() {
  saveLoading.value = true
  try {
    await apiUpdateProfile({ key: 'email', value: profile.value.email }) // 一次改一项示例
    ElMessage.success('个人信息已更新')
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.msg || '更新失败')
  } finally {
    saveLoading.value = false
  }
}

/* ---------- 我的反馈 ---------- */
const feedbacks = ref<any[]>([])
const loading = ref(false)
async function loadMyPosts() {
  loading.value = true
  try {
    const res = await apiGetMyPosts(userStore.userId)
    feedbacks.value = res.data || res || []
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.msg || '获取列表失败')
  } finally {
    loading.value = false
  }
}

/* ---------- 提交反馈 ---------- */
const form = ref<{
  title: string
  content: string
  level: 1 | 2
  hide: 1 | 2
}>({
  title: '',
  content: '',
  level: 2,
  hide: 2
})
const picFiles = ref<any[]>([])
const picInput = ref<HTMLInputElement | null>(null)
function triggerPicSelect() {
  picInput.value?.click()
}
async function onPicChange(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  if (!files.length) return
  const left = 3 - picFiles.value.length
  for (const f of files.slice(0, left)) {
    try {
      const { data } = await apiUploadPostImage(f)
      picFiles.value.push({ file: f, url: data.url })
    } catch (err: any) {
      ElMessage.error(err?.response?.data?.msg || '图片上传失败')
    }
  }
  ;(e.target as HTMLInputElement).value = ''
}
function removePic(idx: number) {
  URL.revokeObjectURL(picFiles.value[idx].url)
  picFiles.value.splice(idx, 1)
}
async function handleSubmit() {
  if (!form.value.title || !form.value.content) {
    ElMessage.warning('请填标题和内容')
    return
  }
  try {
    await apiSubmitPost({
      userId: userStore.userId,
      title: form.value.title,
      content: form.value.content,
      level: form.value.level,
      hide: form.value.hide
    })
    ElMessage.success('提交成功')
    form.value = { title: '', content: '', level: 2, hide: 2 }
    picFiles.value = []
    await loadMyPosts()
    activeMenu.value = 'mine'
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.msg || '提交失败')
  }
}

/* ---------- 查看 & 评价弹窗 ---------- */
const showViewDlg = ref(false)
const viewPost = ref<any>({})
function openView(p: any) {
  viewPost.value = p
  showViewDlg.value = true
}

const showReplyDlg = ref(false)
const replyText = ref('')
const replyStar = ref(5)
const currentReplyPost = ref<any>({})
function openReply(p: any) {
  currentReplyPost.value = p
  replyText.value = ''
  replyStar.value = 5
  showReplyDlg.value = true
}
async function submitReply() {
  if (!replyStar.value) {
    ElMessage.warning('请先选择星级')
    return
  }
  try {
    await apiComment({
      userId: userStore.userId,
      postId: currentReplyPost.value.postId,
      content: replyText.value.trim()
    })
    ElMessage.success('评价已提交')
    showReplyDlg.value = false
    await loadMyPosts()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.msg || '提交失败')
  }
}
function triggerAvatarSelect() {
  (fileInput.value as HTMLInputElement)?.click()
}

/* ---------- 生命周期 ---------- */
function switchMenu(key: string) {
  activeMenu.value = key
  if (key === 'mine') loadMyPosts()
}
onMounted(() => switchMenu('profile'))
</script>