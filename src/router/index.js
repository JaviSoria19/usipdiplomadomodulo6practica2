import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import PanelView from '../views/PanelView.vue'
import ColegiosView from '../views/ColegiosView.vue'
import CursosView from '../views/CursosView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: LoginView 
  },
  {
    path: '/panel',
    component: PanelView,
    meta: { requiresAuth: true }
  },
  {
    path: '/colegios',
    component: ColegiosView,
    meta: { requiresAuth: true }
  },
  {
    path: '/cursos',
    component: CursosView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Middleware de autenticación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
