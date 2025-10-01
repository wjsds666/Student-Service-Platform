<template>
  <div class="top-bar">
    <span class="title">学生服务中心</span>
  </div>
  <div class="login-wrapper">
    <div class="login-background">
      <div class="tab-container">
        <div
          class="tab-btn"
          :class="{ active: loginType === 'student' }"
          @click="setLoginType('student')">
          学生
        </div>
        <div
          class="tab-btn"
          :class="{ active: loginType === 'admin' }"
          @click="setLoginType('admin')">
          管理员
        </div>
      </div>
      <div v-if="loginType === 'student'" class="form-panel">
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label>用户名</label>
            <input v-model="loginForm.userName" type="text" placeholder="请输入用户名" />
          </div>
          <div class="form-group">
            <label>密码</label>
            <input v-model="loginForm.password" type="password" placeholder="请输入密码" />
          </div>
          <button type="submit" class="submit-btn">登录</button>
          <button type="button" class="submit-btn" @click="navigateToRegister">注册</button>
        </form>
      </div>
      <div v-if="loginType === 'admin'" class="form-panel">
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label>管理员账号</label>
            <input v-model="loginForm.userName" type="text" placeholder="请输入管理员账号" />
          </div>
          <div class="form-group">
            <label>密码</label>
            <input v-model="loginForm.password" type="password" placeholder="请输入密码" />
          </div>
          <button type="submit" class="submit-btn">登录</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import './login.css'
import { reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const userStore = useUserStore()
const router   = useRouter()

const loginType = ref     ('student') 
const loginForm = reactive({ userName: '', password: '' })

function setLoginType(type) {
  loginType.value = type
  console.log(loginType.value)
}

function navigateToRegister() {
  router.push('/register')
}

async function handleLogin() {
  if (!loginForm.userName || !loginForm.password) {
    ElMessage.warning('请填写完整')
    return
  }
  try {
    await userStore.login({
      userName: loginForm.userName,
      password: loginForm.password
    })

    if (loginType.value === 'student') {
      if (userStore.isStudent) {
        router.push('/stuhome')
      } else {
        ElMessage.error('请输入正确的学生账号')
        userStore.logout()   
      }
      return
    }

    if (userStore.isAdmin) {
      router.push('/admhome')
    } else if (userStore.isSuper) {
      router.push('/aphome')
    } else {
      ElMessage.error('当前账号不是管理员身份')
      userStore.logout()
    }
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || '登录失败')
  }
}
</script>