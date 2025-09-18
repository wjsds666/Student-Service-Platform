import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const login     = () => import('@/pages/login/login.vue')
const register  = () => import('@/pages/register/register.vue')
const stuhome   = () => import('@/pages/stuhome/stuhome.vue')
const aphome    = () => import('@/pages/aphome/aphome.vue')
const admhome = () => import('@/pages/admhome/admhome.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login',    name: 'login',    component: login,    meta: { title: '登录' } },
    { path: '/register', name: 'register', component: register, meta: { title: '注册' } },
    { path: '/stuhome',  name: 'stuhome',  component: stuhome,  meta: { title: '学生主页' } },
    { path: '/admhome',  name: 'admhome',  component: admhome,meta: { title: '管理员主页' } },
    { path: '/aphome',   name: 'aphome',   component: aphome,   meta: { title: '超管主页' } }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta?.title) document.title = to.meta.title

  const user = useUserStore()
  if (!user.userType) user.restore()

  const token = localStorage.getItem('token')


  if (to.name === 'login' && token) {
    user.logout()   
    return next()
  }


  if (['stuhome', 'admhome', 'aphome'].includes(to.name) && !token) return next('/login')

  if (to.name === 'login' && token) {
    if (user.isStudent) return next('/stuhome')
    if (user.isAdmin)   return next('/admhome')
    return next('/aphome')
  }

  next()
})

export default router