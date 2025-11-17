import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ToastService from 'primevue/toastservice';

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: false
        }
    }
})

app.use(router)
app.use(pinia)
app.use(ToastService);

app.mount('#app')
