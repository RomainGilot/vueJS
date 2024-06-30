import './assets/main.css'

import { createApp } from 'vue'
import axiosPlugin from './plugins/axios'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const pinia = createPinia()

const app = createApp(App)

app.use(axiosPlugin)

app.use(pinia)
app.use(router)

app.mount('#app')
