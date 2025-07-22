<template>
  <div class="container mt-4">
    <h2 class="fw-bold">Bienvenido, {{ user?.nombres }} {{ user?.apellidoPaterno }} {{ user?.apellidoMaterno }} - {{ user?.tipoPerfil }}</h2>
    <p>Por favor navegue mediante los botones que están encima de este mensaje.</p>
    <button @click="logout" class="btn btn-warning"><i class="fas fa-arrow-right-from-bracket"></i> Cerrar Sesión</button>
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
