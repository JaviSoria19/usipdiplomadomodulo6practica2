<template>
  <div>
    <h2>Bienvenido, {{ user?.nombres }}</h2>
    <p>Rol: {{ user?.tipoPerfil }}</p>
    <button @click="logout">Cerrar sesión</button>
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
