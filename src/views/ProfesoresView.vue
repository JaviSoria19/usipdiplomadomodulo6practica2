<template>
    <div class="container mt-4">
        <h2 class="mb-4 fw-bold">← Gestión de Profesores →</h2>

        <h3 class="mb-4 fw-bold text-start"><i class="fas fa-search"></i> Búsqueda y <i class="fas fa-filter"></i> Filtro:</h3>
        <div class="row mb-3">
            <div class="col-md-6">
                <input type="text" class="form-control" placeholder="Buscar..." v-model="searchTerm" />
            </div>
            <div class="col-md-3">
                <select class="form-select" v-model="searchTerm">
                    <option value="">Todos los estados</option>
                    <option>ACTIVO</option>
                    <option>INACTIVO</option>
                </select>
            </div>
            <div class="col-md-3 text-end">
                <button class="btn btn-success" @click="abrirCrear"><i class="fas fa-chalkboard-teacher"></i> Nuevo Profesor</button>
            </div>
        </div>

        <h3 class="mb-4 fw-bold text-start"><i class="fas fa-table"></i> Registros:</h3>
        <table class="table table-bordered table-striped">
            <thead class="table-light">
                <tr>
                    <th>#</th>
                    <th>Nombre completo</th>
                    <th>C.I.</th>
                    <th>Título</th>
                    <th>Celular</th>
                    <th>Estado</th>
                    <th class="text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(profesor, index) in profesoresFiltrados" :key="profesor.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ profesor.user?.nombres }} {{ profesor.user?.apellidoPaterno }} {{ profesor.user?.apellidoMaterno }}</td>
                    <td>{{ profesor.user?.cedulaIdentidadNumero }} {{ profesor.user?.cedulaIdentidadExpedido }}</td>
                    <td>{{ profesor.tituloAcademico }}</td>
                    <td>{{ profesor.numeroCelular }}</td>
                    <td>{{ profesor.estado }}</td>
                    <td class="text-center">
                        <button class="btn btn-warning btn-sm me-2" @click="abrirEditar(profesor)"><i class="fas fa-pen"></i> Editar</button>
                        <button class="btn btn-danger btn-sm" @click="eliminarProfesor(profesor.id)"><i class="fas fa-trash"></i> Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <ProfesorFormModal v-if="mostrarModal" :mostrar="mostrarModal" :modo-edicion="modoEdicion"
            :profesor-editado="profesorEditado" :usuarios-profesores="usuariosProfesores" @cerrar="cerrarModal"
            @guardar="cargarProfesores" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '../axios'
import ProfesorFormModal from '../components/ProfesorFormModal.vue'

const profesores = ref([])
const usuariosProfesores = ref([])
const mostrarModal = ref(false)
const modoEdicion = ref(false)
const profesorEditado = ref(null)
const searchTerm = ref('')

const cargarProfesores = async () => {
    const { data } = await axios.get('/profesores?_expand=user')
    profesores.value = data
}

const cargarUsuarios = async () => {
    const { data } = await axios.get('/users?tipoPerfil=PROFESOR')
    usuariosProfesores.value = data
}

const profesoresFiltrados = computed(() => {
    return profesores.value.filter(p => {
        const texto = searchTerm.value.toLowerCase()
        return Object.values(p.user ?? {}).some(v =>
            v?.toString().toLowerCase().includes(texto)
        ) || p.tituloAcademico.toLowerCase().includes(texto)
    })
})

const abrirCrear = () => {
    profesorEditado.value = null
    modoEdicion.value = false
    mostrarModal.value = true
}

const abrirEditar = (profesor) => {
    profesorEditado.value = { ...profesor }
    modoEdicion.value = true
    mostrarModal.value = true
}

const cerrarModal = () => {
    mostrarModal.value = false
}

const eliminarProfesor = async (id) => {
    if (confirm('¿Eliminar este profesor?')) {
        await axios.delete(`/profesores/${id}`)
        cargarProfesores()
    }
}

onMounted(() => {
    cargarProfesores()
    cargarUsuarios()
})
</script>
