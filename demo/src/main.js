import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')