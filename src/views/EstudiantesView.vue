<template>
  <div class="container mt-4">
    <h2 class="mb-4 fw-bold">← Gestión de Estudiantes →</h2>

    <h3 class="mb-4 fw-bold text-start"><i class="fas fa-search"></i> Búsqueda y <i class="fas fa-filter"></i> Filtros:
    </h3>
    <div class="row mb-3">
      <div class="col-md-4">
        <input type="text" class="form-control" v-model="searchTerm" placeholder="Buscar..." />
      </div>
      <div class="col-md-2">
        <select class="form-select" v-model="filtroGrupo">
          <option value="">Todos los grupos sanguíneos</option>
          <option v-for="grupo in gruposSanguineos" :key="grupo" :value="grupo">{{ grupo }}</option>
        </select>
      </div>
      <div class="col-md-2">
        <select class="form-select" v-model="filtroCurso">
          <option value="">Todos los cursos</option>
          <option v-for="curso in cursos" :key="curso.id" :value="curso.id">{{ curso.nombreCurso }}</option>
        </select>
      </div>
      <div class="col-md-2">
        <select class="form-select" v-model="filtroEstado">
          <option value="">Todos los estados</option>
          <option>ACTIVO</option>
          <option>INACTIVO</option>
        </select>
      </div>
      <div class="col-md-2 text-end">
        <button class="btn btn-success" @click="abrirCrear"><i class="fas fa-user-graduate"></i> Nuevo
          Estudiante</button>
      </div>
    </div>

    <h3 class="mb-4 fw-bold text-start"><i class="fas fa-table"></i> Registros:</h3>
    <table class="table table-bordered table-striped">
      <thead class="table-light">
        <tr>
          <th>#</th>
          <th>Nombre completo</th>
          <th>CI</th>
          <th>Alergia/s</th>
          <th>Grupo Sanguíneo</th>
          <th>Curso</th>
          <th>Estado</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(estudiante, index) in estudiantesFiltrados" :key="estudiante.id">
          <td>{{ index + 1 }}</td>
          <td>{{ estudiante.user?.nombres }} {{ estudiante.user?.apellidoPaterno }} {{ estudiante.user?.apellidoMaterno
            }}</td>
          <td>{{ estudiante.user?.cedulaIdentidadNumero }} {{ estudiante.user?.cedulaIdentidadExpedido }}</td>
          <td>{{ estudiante.saludAlergias }}</td>
          <td>{{ estudiante.saludGrupoSanguineo }}</td>
          <td>{{ estudiante.curso?.nombreCurso }}</td>
          <td>{{ estudiante.estado }}</td>
          <td class="text-center">
            <button class="btn btn-warning btn-sm me-2" @click="abrirEditar(estudiante)"><i class="fas fa-pen"></i>
              Editar</button>
            <button class="btn btn-danger btn-sm" @click="eliminarEstudiante(estudiante.id)"><i
                class="fas fa-trash"></i>
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
const filtroCurso = ref('')
const filtroEstado = ref('')

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
  return estudiantes.value.filter(estudiante => {
    const texto = searchTerm.value.toLowerCase()
    const coincideBusqueda = Object.values(estudiante.user ?? {}).some(v =>
      v?.toString().toLowerCase().includes(texto)
    ) || (estudiante.saludGrupoSanguineo ?? '').toLowerCase().includes(texto)

    const coincideGrupo = filtroGrupo.value === '' || estudiante.saludGrupoSanguineo === filtroGrupo.value
    const coincideCurso = filtroCurso.value === '' || estudiante.curso?.id === filtroCurso.value
    const coincideEstado = filtroEstado.value === '' || estudiante.estado === filtroEstado.value
    return coincideBusqueda && coincideGrupo && coincideCurso && coincideEstado
  })
})

const abrirCrear = () => {
  estudianteEditado.value = null
  modoEdicion.value = false
  mostrarModal.value = true
}

const abrirEditar = (estudiante) => {
  estudianteEditado.value = { ...estudiante }
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
