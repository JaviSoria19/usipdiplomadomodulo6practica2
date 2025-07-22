<template>
  <div class="container mt-4">
    <h2 class="mb-4">Gestión de Asignaturas</h2>

    <div class="row mb-3">
      <div class="col-md-4">
        <input type="text" class="form-control" v-model="searchTerm" placeholder="Buscar asignatura..." />
      </div>
      <div class="col-md-2">
        <button class="btn btn-primary w-100" @click="abrirCrear">Nueva Asignatura</button>
      </div>
    </div>

    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>Nombre</th>
          <th>Abreviatura</th>
          <th>Profesor</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in asignaturasFiltradas" :key="a.id">
          <td>{{ a.nombreAsignatura }}</td>
          <td>{{ a.abreviatura }}</td>
          <td>{{ a.profesor?.user?.nombres }} {{ a.profesor?.user?.apellidoPaterno }}</td>
          <td class="text-center">
            <button class="btn btn-warning btn-sm me-2" @click="abrirEditar(a)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="eliminarAsignatura(a.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <AsignaturaFormModal
      v-if="mostrarModal"
      :mostrar="mostrarModal"
      :modo-edicion="modoEdicion"
      :asignatura-editada="asignaturaEditada"
      :profesores="profesores"
      @cerrar="cerrarModal"
      @guardar="cargarAsignaturas"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '../axios'
import AsignaturaFormModal from '../components/AsignaturaFormModal.vue'

const asignaturas = ref([])
const profesores = ref([])

const mostrarModal = ref(false)
const modoEdicion = ref(false)
const asignaturaEditada = ref(null)
const searchTerm = ref('')

const cargarAsignaturas = async () => {
  const { data } = await axios.get('/asignaturas?_expand=profesor&_expand=profesor.user')
  asignaturas.value = data
}

const cargarProfesores = async () => {
  const { data } = await axios.get('/profesores?_expand=user')
  profesores.value = data
}

const asignaturasFiltradas = computed(() => {
  const texto = searchTerm.value.toLowerCase()
  return asignaturas.value.filter(a =>
    a.nombreAsignatura.toLowerCase().includes(texto) ||
    a.abreviatura.toLowerCase().includes(texto) ||
    (a.profesor?.user?.nombres?.toLowerCase().includes(texto) || '') ||
    (a.profesor?.user?.apellidoPaterno?.toLowerCase().includes(texto) || '')
  )
})

const abrirCrear = () => {
  asignaturaEditada.value = null
  modoEdicion.value = false
  mostrarModal.value = true
}

const abrirEditar = (a) => {
  asignaturaEditada.value = { ...a }
  modoEdicion.value = true
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const eliminarAsignatura = async (id) => {
  if (confirm('¿Eliminar esta asignatura?')) {
    await axios.delete(`/asignaturas/${id}`)
    cargarAsignaturas()
  }
}

onMounted(() => {
  cargarAsignaturas()
  cargarProfesores()
})
</script>
