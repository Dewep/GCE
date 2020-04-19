import { createApp } from 'vue'
import App from './app.vue'
import './main.css'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
