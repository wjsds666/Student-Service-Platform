import { defineStore } from 'pinia'
import { apiLogin } from '@/api/user'
import axios from 'axios'
import router from '@//router'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    refresh: localStorage.getItem('refresh') || '',
    userId: Number(localStorage.getItem('userId')) || 0,
    userType: Number(localStorage.getItem('userType')) || 0
  }),

  getters: {
    isLogin:  (s) => !!s.token,
    isStudent:(s) => s.userType === 1,
    isAdmin:  (s) => s.userType === 2,
    isSuper:  (s) => s.userType === 3
  },

  actions: {
    /* 恢复状态（刷新页面时） */
    restore() {
      this.token   = localStorage.getItem('token') || ''
      this.refresh = localStorage.getItem('refresh') || ''
      this.userId  = Number(localStorage.getItem('userId')) || 0
      this.userType= Number(localStorage.getItem('userType')) || 0
    },

    /* 登录：形参改成下划线，与调用处 form.username 对齐 */
    async login(form: { username: string; password: string }) {
      console.log('即将发登录', form)
      const { data } = await apiLogin(form)
      console.log('登录返回', data)
      console.log('头像路径', data.avatarUrl || '')

      this.token   = data.token
      this.refresh = data.refresh || ''
      this.userId  = data.userId
      this.userType= data.userType

      // 强制写 localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('refresh', data.refresh || '')
      localStorage.setItem('userType', String(data.userType))
      localStorage.setItem('userId', String(data.userId))
      localStorage.setItem('avatarUrl', data.avatarUrl || '')   // ← 强制写头像

      console.log('存完token', localStorage.getItem('token'))

      /* 按角色跳转 */
      if (this.isStudent) router.push({ name: 'stuhome', replace: true })
      else if (this.isAdmin)  router.push({ name: 'admhome', replace: true })
      else                    router.push({ name: 'aphome',  replace: true })
    },

    /* 刷新 accessToken（供 axios 拦截器调用） */
    async refreshToken(): Promise<boolean> {
      const refresh = localStorage.getItem('refresh')
      if (!refresh) return false
      try {
        const { data } = await axios.post('/api/user/refresh', { refresh })
        this.token = data.token
        localStorage.setItem('token', data.token)
        return true
      } catch {
        return false
      }
    },

    /* 退出登录 */
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('userType')
      localStorage.removeItem('refresh')
      localStorage.removeItem('avatarUrl')   // ← 强制清头像
      this.$reset()
      router.replace('/login')
    }
  },
})