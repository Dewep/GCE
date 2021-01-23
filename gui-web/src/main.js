import { createApp } from 'vue'
import App from './app.vue'
import '../../shared/css/main.css'
import '../../shared/css/fontawesome.css'
import '../../shared/css/fontawesome-fonts.css'
import router from './router'
import pkg from '../package.json'

window.gceVersion = pkg.version

const app = createApp(App)

app.use(router)

app.mount('#app')
