import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import VueCookies from 'vue-cookies'
import Notifications from '@kyvg/vue3-notification'

import './assets/styles/main.css'

createApp(App).use(store).use(router).use(VueCookies).use(Notifications).mount('#app')
