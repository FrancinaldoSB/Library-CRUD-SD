import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/user/LoginView.vue'
import { AuthService } from '@/services/api'

// Importação com tratamento de erro
const CadastroUser = () => import('@/views/user/cadastroUser.vue')
  .catch(err => {
    console.error('Erro ao carregar o componente CadastroUser:', err)
    return import('@/components/ErrorComponent.vue')
  })

// Importação do Dashboard
const DashboardView = () => import('@/views/book/homebook.vue')
  .catch(err => {
    console.error('Erro ao carregar o Dashboard:', err)
    return import('@/components/ErrorComponent.vue')
  })

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/cadastro-usuario',
    name: 'cadastro',
    component: CadastroUser,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guarda de navegação para proteger rotas
router.beforeEach((to, from, next) => {
  console.log(`Navegando de ${from.path} para ${to.path}`)
  
  // Verifica se a rota requer autenticação
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = AuthService.getCurrentUser()
  
  if (requiresAuth && !isAuthenticated) {
    // Se a rota requer autenticação e o usuário não está autenticado, redirecione para o login
    next('/')
  } else if (!requiresAuth && isAuthenticated && (to.path === '/' || to.path === '/cadastro-usuario')) {
    // Se o usuário já está autenticado e tenta acessar login/cadastro, redirecione para o dashboard
    next('/dashboard')
  } else {
    // Caso contrário, permita a navegação
    next()
  }
})

export default router
