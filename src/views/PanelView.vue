<template>
  <div class="row-md-12">
    <h2 class="fw-bold">Bienvenido, {{ user?.nombres }}</h2>
    <p>{{ user?.tipoPerfil }}</p>
    <button @click="logout" class="btn btn-secondary">Cerrar sesión</button>
  </div>
</template>

<script setup>
import { useUserStore } from '../store/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const user = userStore.user

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>
