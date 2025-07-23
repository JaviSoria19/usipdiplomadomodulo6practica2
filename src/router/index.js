import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import PanelView from '../views/PanelView.vue'
import ColegiosView from '../views/ColegiosView.vue'
import CursosView from '../views/CursosView.vue'
import UsersView from '../views/UsersView.vue'
import ProfesoresView from '../views/ProfesoresView.vue'
import EstudiantesView from '../views/EstudiantesView.vue'
import AsignaturasView from '../views/AsignaturasView.vue'
import CalificacionesView from '../views/CalificacionesView.vue'

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
  },
  {
    path: '/users',
    component: UsersView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profesores',
    component: ProfesoresView,
    meta: { requiresAuth: true }
  },
  {
    path: '/estudiantes',
    component: EstudiantesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/asignaturas',
    component: AsignaturasView,
    meta: { requiresAuth: true }
  },
  {
    path: '/calificaciones',
    component: CalificacionesView,
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
