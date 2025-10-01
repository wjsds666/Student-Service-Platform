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

router.beforeEach(async (to, from, next) => {
  if (typeof to.meta?.title === 'string') document.title = to.meta.title

  const user = useUserStore()
  const token = localStorage.getItem('token')

  // 仅在 userType 未定义时调用 restore
  if (!user.userType) {
    try {
      await user.restore()
    } catch (error) {
      console.error('Failed to restore user:', error)
      return next('/login')
    }
  }

  // 如果已登录且访问登录页，则登出并重定向到首页
  if (to.name === 'login' && token) {
    await user.logout()
    return next()
  }

  // 如果未登录且访问受保护路由，则重定向到登录页
  if (typeof to.name === 'string' && ['stuhome', 'admhome', 'aphome'].includes(to.name) && !token) {
    return next('/login')
  }

  // 如果已登录且访问登录页，根据用户角色重定向
  if (to.name === 'login' && token) {
    if (user.isStudent) return next('/stuhome')
    if (user.isAdmin) return next('/admhome')
    return next('/aphome')
  }

  next()
})

export default router