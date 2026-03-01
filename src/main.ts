import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useUserStore } from './stores/user'
import { useThemeStore } from './stores/theme'
import './assets/styles/global.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化用户设置
const userStore = useUserStore()
userStore.loadLanguage()
userStore.loadFavorites()

// 初始化主题
const themeStore = useThemeStore()
themeStore.loadTheme()

app.mount('#app')
