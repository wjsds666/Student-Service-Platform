import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // 样式必须引入
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import service, { setAuthHandlers } from '@/utils/request'

const app = createApp(App)
const pinia = createPinia()

/* 关键：注册 ElementPlus */
app.use(ElementPlus)

/* 注入 axios 拦截器依赖 */
const userStore = useUserStore(pinia)
setAuthHandlers(userStore.refreshToken, userStore.logout)

app.use(pinia).use(router).mount('#app')

/* 导出 service 供别处使用 */
export { service }