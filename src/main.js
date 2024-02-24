import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Vue3Openlayers from "vue3-openlayers";
// 通用字体
import 'vfonts/Lato.css'

const app = createApp(App)

app.use(Vue3Openlayers)
app.use(createPinia())
app.use(router)

app.mount('#app')
