<template>
  <div class="container mt-4">
    <h2 class="mb-4 fw-bold">← Gestión de Estudiantes →</h2>

    <h3 class="mb-4 fw-bold text-start"><i class="fas fa-filter"></i> Filtro y <i class="fas fa-search"></i> Búsqueda:</h3>
    <div class="row mb-3">
      <div class="col-md-4">
        <input type="text" class="form-control" v-model="searchTerm" placeholder="Buscar estudiante..." />
      </div>
      <div class="col-md-3">
        <select class="form-select" v-model="filtroGrupo">
          <option value="">Filtrar por grupo sanguíneo</option>
          <option v-for="grupo in gruposSanguineos" :key="grupo" :value="grupo">{{ grupo }}</option>
        </select>
      </div>
      <div class="col-md-2">
        <button class="btn btn-success w-100" @click="abrirCrear"><i class="fas fa-user-graduate"></i> Nuevo Estudiante</button>
      </div>
    </div>

    <h3 class="mb-4 fw-bold text-start"><i class="fas fa-table"></i> Registros:</h3>
    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>Nombre completo</th>
          <th>CI</th>
          <th>Alergia/s</th>
          <th>Grupo Sanguíneo</th>
          <th>Curso</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in estudiantesFiltrados" :key="e.id">
          <td>{{ e.user?.nombres }} {{ e.user?.apellidoPaterno }} {{ e.user?.apellidoMaterno }}</td>
          <td>{{ e.user?.cedulaIdentidadNumero }} {{ e.user?.cedulaIdentidadExpedido }}</td>
          <td>{{ e.saludAlergias }}</td>
          <td>{{ e.saludGrupoSanguineo }}</td>
          <td>{{ e.curso?.nombreCurso }}</td>
          <td class="text-center">
            <button class="btn btn-warning btn-sm me-2" @click="abrirEditar(e)"><i class="fas fa-pen"></i>
              Editar</button>
            <button class="btn btn-danger btn-sm" @click="eliminarEstudiante(e.id)"><i class="fas fa-trash"></i>
              Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <EstudianteFormModal v-if="mostrarModal" :mostrar="mostrarModal" :modo-edicion="modoEdicion"
      :estudiante-editado="estudianteEditado" :usuarios-estudiantes="usuariosEstudiantes" :cursos="cursos"
      @cerrar="cerrarModal" @guardar="cargarEstudiantes" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '../axios'
import EstudianteFormModal from '../components/EstudianteFormModal.vue'

const estudiantes = ref([])
const usuariosEstudiantes = ref([])
const cursos = ref([])

const mostrarModal = ref(false)
const modoEdicion = ref(false)
const estudianteEditado = ref(null)
const searchTerm = ref('')
const filtroGrupo = ref('')

const gruposSanguineos = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

const cargarEstudiantes = async () => {
  const { data } = await axios.get('/estudiantes?_expand=user&_expand=curso')
  estudiantes.value = data
}

const cargarUsuarios = async () => {
  const { data } = await axios.get('/users?tipoPerfil=ESTUDIANTE')
  usuariosEstudiantes.value = data
}

const cargarCursos = async () => {
  const { data } = await axios.get('/cursos')
  cursos.value = data
}

const estudiantesFiltrados = computed(() => {
  return estudiantes.value.filter(e => {
    const texto = searchTerm.value.toLowerCase()
    const coincideBusqueda = Object.values(e.user ?? {}).some(v =>
      v?.toString().toLowerCase().includes(texto)
    ) || (e.saludGrupoSanguineo ?? '').toLowerCase().includes(texto)

    const coincideGrupo = filtroGrupo.value === '' || e.saludGrupoSanguineo === filtroGrupo.value

    return coincideBusqueda && coincideGrupo
  })
})

const abrirCrear = () => {
  estudianteEditado.value = null
  modoEdicion.value = false
  mostrarModal.value = true
}

const abrirEditar = (e) => {
  estudianteEditado.value = { ...e }
  modoEdicion.value = true
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const eliminarEstudiante = async (id) => {
  if (confirm('¿Eliminar este estudiante?')) {
    await axios.delete(`/estudiantes/${id}`)
    cargarEstudiantes()
  }
}

onMounted(() => {
  cargarEstudiantes()
  cargarUsuarios()
  cargarCursos()
})
</script>
