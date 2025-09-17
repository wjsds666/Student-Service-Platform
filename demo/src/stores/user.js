import { defineStore } from 'pinia'
import { apiLogin } from '@/api/user'
import router from '@/router'
export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userId: 0,
    userType: 0
  }),

  getters: {
    isLogin:  (s) => !!s.token,
    isStudent:(s) => s.userType === 1,
    isAdmin:  (s) => s.userType === 2,
    isSuper:  (s) => s.userType === 3
  },


  actions: {
    async login(form) {
      const { data } = await apiLogin(form)
      this.token = data.token
      this.userId = data.userId
      this.userType = data.userType
      localStorage.setItem('token', data.token)
      localStorage.setItem('userType', data.userType)

      if (this.isStudent) router.push('/stuhome')
      else if (this.isAdmin)  router.push('/admhome')
      else                    router.push('/aphome')
    },

    logout() {
      localStorage.clear()
      this.$reset()
      router.push('/login')
    }
  }
})