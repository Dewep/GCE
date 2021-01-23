import { createApp } from 'vue'
import App from './app.vue'
import '../../shared/css/main.css'
import '../../shared/css/fontawesome.css'
import '../../shared/css/fontawesome-fonts.css'
import router from './router'
import { version } from '../../package.json'

window.gceVersion = version

const app = createApp(App)

app.use(router)

app.mount('#app')
