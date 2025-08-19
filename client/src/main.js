import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Criando a instância do Vue e montando no elemento #app
const app = createApp(App)
app.use(router)
app.mount('#app')

// Adicionando log para depuração
console.log('Vue app initialized with router', router.getRoutes())
