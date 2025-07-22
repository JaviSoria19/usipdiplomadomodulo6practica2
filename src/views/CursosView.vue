<template>
    <div class="container mt-4">
        <h2 class="mb-4 fw-bold">← Gestión de Cursos →</h2>

        <!-- Filtros y Búsqueda -->
        <h3 class="mb-4 fw-bold text-start"><i class="fas fa-filter"></i> Filtros y <i class="fas fa-search"></i> Búsqueda:</h3>
        <div class="row mb-3">
            <div class="col-md-4">
                <input type="text" class="form-control" placeholder="Buscar..." v-model="searchTerm" />
            </div>
            <div class="col-md-2">
                <select class="form-select" v-model="filtroNivel">
                    <option value="">Todos los niveles</option>
                    <option>PRIMARIA</option>
                    <option>SECUNDARIA</option>
                </select>
            </div>
            <div class="col-md-2">
                <select class="form-select" v-model="filtroParalelo">
                    <option value="">Todos los paralelos</option>
                    <option>A</option>
                    <option>B</option>
                </select>
            </div>
            <div class="col-md-2">
                <select class="form-select" v-model="filtroEstado">
                    <option value="">Todos los estados</option>
                    <option>ACTIVO</option>
                    <option>INACTIVO</option>
                </select>
            </div>
            <div class="col-md-2">
                <button class="btn btn-success w-100" @click="abrirCrear"><i class="fas fa-chalkboard"></i> Nuevo Curso</button>
            </div>
        </div>

        <!-- Tabla -->
        <h3 class="mb-4 fw-bold text-start"><i class="fas fa-table"></i> Registros:</h3>
        <table class="table table-bordered table-striped">
            <thead class="table-light">
                <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Nivel</th>
                    <th>Paralelo</th>
                    <th>Estado</th>
                    <th class="text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(curso, index) in cursosFiltrados" :key="curso.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ curso.nombreCurso }}</td>
                    <td>{{ curso.nivel }}</td>
                    <td>{{ curso.paralelo }}</td>
                    <td>{{ curso.estado }}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-warning me-2" @click="abrirEditar(curso)"><i class="fas fa-pen"></i> Editar</button>
                        <button class="btn btn-sm btn-danger" @click="eliminarCurso(curso.id)"><i class="fas fa-trash"></i> Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal -->
        <CursoFormModal v-if="mostrarModal" :mostrar="mostrarModal" :modo-edicion="modoEdicion"
            :curso-editado="cursoEditado" @cerrar="cerrarModal" @guardar="cargarCursos" />

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '../axios'

import CursoFormModal from '../components/CursoFormModal.vue'

const cursos = ref([])
const mostrarModal = ref(false)
const modoEdicion = ref(false)
const cursoEditado = ref(null)

const searchTerm = ref('')
const filtroNivel = ref('')
const filtroParalelo = ref('')
const filtroEstado = ref('')

const cargarCursos = async () => {
    const { data } = await axios.get('http://localhost:3000/cursos')
    cursos.value = data
}

const cursosFiltrados = computed(() => {
    return cursos.value.filter(curso => {
        const coincideTexto =
            Object.values(curso).some(valor =>
                valor.toString().toLowerCase().includes(searchTerm.value.toLowerCase())
            )

        const coincideNivel = filtroNivel.value === '' || curso.nivel === filtroNivel.value
        const coincideParalelo = filtroParalelo.value === '' || curso.paralelo === filtroParalelo.value
        const coincideEstado = filtroEstado.value === '' || curso.estado === filtroEstado.value

        return coincideTexto && coincideNivel && coincideParalelo && coincideEstado
    })
})

const abrirCrear = () => {
    cursoEditado.value = null
    modoEdicion.value = false
    mostrarModal.value = true
}

const abrirEditar = (curso) => {
    cursoEditado.value = { ...curso }
    modoEdicion.value = true
    mostrarModal.value = true
}

const cerrarModal = () => {
    mostrarModal.value = false
}

const eliminarCurso = async (id) => {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
        await axios.delete(`http://localhost:3000/cursos/${id}`)
        cargarCursos()
    }
}

onMounted(cargarCursos)
</script>
