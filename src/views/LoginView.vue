<template>
  <div class="login">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" placeholder="E-mail" />
      <input v-model="password" type="password" placeholder="Contraseña" />
      <button type="submit">Ingresar</button>
      <p v-if="error" style="color:red;">Credenciales incorrectas</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'

const email = ref('')
const password = ref('')
const error = ref(false)
const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  const success = await userStore.login(email.value, password.value)
  if (success) {
    router.push('/panel')
  } else {
    error.value = true
  }
}
</script>
