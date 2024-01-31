import './style.css'
import './base.scss'
import {createApp} from 'vue'
import router from "./router";
import {createPinia} from 'pinia'
import PrimeVue from 'primevue/config'
import Wind from './presets/wind/index.js';
import App from './App.vue'
import primeVue from './utils/primeVue.js'
import helpers from './utils/helper.js'

const app = createApp(App)
app.use(PrimeVue, {
    unstyled: true,
    pt: Wind
})
app.use(router)
app.use(createPinia())
app.use(primeVue)
app.use(helpers)
app.mount('#app')
