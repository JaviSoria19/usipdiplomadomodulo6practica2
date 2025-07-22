import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createPinia } from 'pinia'
import axios from 'axios'


createApp(App)
.use(store)
.use(router)
.use(axios)
.use(createPinia())
.mount('#app')
