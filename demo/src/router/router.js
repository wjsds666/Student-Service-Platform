import { createRouter, createWebHistory } from 'vue-router'
import login from '@/pages/login/login.vue'
import register from '@/pages/register/register.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/', // 根路径
      redirect: '/login' // 重定向到登录页
    },
    {
      path: '/login', 
      name: 'login', 
      component: login,
      meta: { 
        keepAlive: false,
        title: '登录'
      }
    },
    {
      path: '/register', 
      name: 'register', 
      component: register,
      meta: { 
        keepAlive: false,
        title: '注册'
      }
    } 
  ]
})

export default router
// 添加导航守卫：每次路由切换时强制刷新页面数据
router.beforeEach((to, from, next) => {
  // 给页面设置标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // 对于需要实时数据的页面，在进入前触发数据刷新
  if (['e', 'c', 'a'].includes(to.name)) {
    // 触发localStorage的storage事件，通知相关组件更新数据
    window.dispatchEvent(new Event('storage'))
  }
  
  next()
})
