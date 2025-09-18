import { defineStore } from 'pinia'
import { apiLogin } from '@/api/user'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
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
    restore() {
      this.token   = localStorage.getItem('token') || ''
      this.userId  = Number(localStorage.getItem('userId')) || 0
      this.userType= Number(localStorage.getItem('userType')) || 0
    },

    async login(form) {
      const { data } = await apiLogin(form)
      this.token = data.token
      this.userId = data.userId
      this.userType = data.userType
      localStorage.setItem('token', data.token)
      localStorage.setItem('userType', data.userType)
      localStorage.setItem('userId', data.userId)

      if (this.isStudent) router.push({ name: 'stuhome', replace: false })
      else if (this.isAdmin)  router.push({ name: 'admhome', replace: false })
      else                    router.push({ name: 'aphome',  replace: false })
    },

    logout() {
      localStorage.clear()
      this.$reset()
      router.push('/login')
    }
  }
})