<template>
  <div class="rounded p-4 bg-light">
    <h2 class="fw-bold">PLATAFORMA EDUCATIVA</h2>
    <img src="https://www.svgrepo.com/show/500816/college.svg" alt="Logo" class="col-md-2 bg-primary border-dark img-thumbnail img-fluid mb-2"/>
    <form @submit.prevent="handleLogin" class="login-form col-md-4 offset-md-4 fw-bold">
      <label class="form-label"><i class="fas fa-envelope"></i> E-mail:</label>
      <input v-model="email" placeholder="E-mail" class="form-control mb-2" />
      <label class="form-label"><i class="fas fa-key"></i> Contraseña:</label>
      <input v-model="password" type="password" placeholder="Contraseña" class="form-control mb-2" />
      <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
      <p v-if="error" class="mt-2 bg-warning rounded text-danger fw-bold">¡CREDENCIALES INCORRECTAS!</p>
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

alert('Estimado tester, bienvenido a la Plataforma Educativa. Por favor inicie sesión para continuar. \nLa contraseña de cualquier usuario es:\nadmin123')
</script>
