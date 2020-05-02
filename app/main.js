import { createApp } from 'vue'
import App from './app.vue'
import './main.css'
import './fontawesome.css'
import './fontawesome-fonts.css'
import router from './router'
import pkg from '../package.json'

window.gceVersion = pkg.version

const app = createApp(App)

app.use(router)

app.mount('#app')
