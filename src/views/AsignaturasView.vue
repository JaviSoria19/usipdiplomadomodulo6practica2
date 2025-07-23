<template>
    <div class="container mt-4">
        <h2 class="mb-4 fw-bold">← Gestión de Asignaturas →</h2>

        <!-- Búsqueda -->
        <h3 class="mb-4 fw-bold text-start"><i class="fas fa-search"></i> Búsqueda y <i class="fas fa-filter"></i>
            Filtro:</h3>
        <div class="row mb-3">
            <div class="col-md-4">
                <input type="text" v-model="busqueda" class="form-control" placeholder="Buscar..." />
            </div>
            <div class="col-md-3">
                <select class="form-select" v-model="filtroProfesor">
                    <option value="">Todos los profesores</option>
                    <option v-for="profesor in profesores" :key="profesor.id" :value="profesor.id">
                        {{ profesor.user.nombres }} {{ profesor.user.apellidoPaterno }}</option>
                </select>
            </div>
            <div class="col-md-2">
                <select class="form-select" v-model="filtroEstado">
                    <option value="">Todos los estados</option>
                    <option>ACTIVO</option>
                    <option>INACTIVO</option>
                </select>
            </div>
            <div class="col-md-3 text-end">
                <button class="btn btn-success" @click="abrirModal()"><i class="fas fa-book"></i> Nueva
                    Asignatura</button>
            </div>
        </div>

        <!-- Tabla -->
        <h3 class="mb-4 fw-bold text-start"><i class="fas fa-table"></i> Registros:</h3>
        <table class="table table-bordered table-striped">
            <thead class="table-light">
                <tr>
                    <th>#</th>
                    <th>Asignatura</th>
                    <th>Abreviatura</th>
                    <th>Profesor</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(asignatura, index) in asignaturasFiltradas" :key="asignatura.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ asignatura.nombreAsignatura }}</td>
                    <td>{{ asignatura.abreviatura }}</td>
                    <td>
                        <span v-if="asignatura.profesor?.user">
                            {{ asignatura.profesor.user.nombres }} {{ asignatura.profesor.user.apellidoPaterno }}
                        </span>
                        <span v-else class="text-muted">Sin asignar</span>
                    </td>
                    <td>{{ asignatura.estado }}</td>
                    <td>
                        <button class="btn btn-sm btn-warning me-1" @click="abrirModal(asignatura)"><i
                                class="fas fa-pen"></i>
                            Editar</button>
                        <button class="btn btn-sm btn-danger" @click="eliminarAsignatura(asignatura.id)"><i
                                class="fas fa-trash"></i> Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <AsignaturaFormModal v-if="mostrarModal" :mostrar="mostrarModal" :modo-edicion="modoEdicion"
            :asignatura-editada="asignaturaEditada" :profesores="profesores" @cerrar="cerrarModal"
            @guardar="cargarAsignaturas" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import AsignaturaFormModal from '../components/AsignaturaFormModal.vue'

const asignaturas = ref([])
const profesores = ref([])

const mostrarModal = ref(false)
const modoEdicion = ref(false)
const asignaturaEditada = ref(null)

const busqueda = ref('')
const filtroProfesor = ref('')
const filtroEstado = ref('')

const cargarAsignaturas = async () => {
    const resAsig = await axios.get('http://localhost:3000/asignaturas')
    const resProf = await axios.get('http://localhost:3000/profesores?_expand=user')

    // Fusionar manualmente profesor con user en cada asignatura
    asignaturas.value = resAsig.data.map(asig => {
        const prof = resProf.data.find(p => p.id === asig.profesorId)
        return {
            ...asig,
            profesor: prof
        }
    })

    profesores.value = resProf.data
}

const abrirModal = (asig = null) => {
    modoEdicion.value = !!asig
    asignaturaEditada.value = asig ? { ...asig } : null
    mostrarModal.value = true
}

const cerrarModal = () => {
    mostrarModal.value = false
}

const eliminarAsignatura = async id => {
    const confirmacion = confirm('¿Estás seguro de eliminar esta asignatura?')
    if (confirmacion) {
        await axios.delete(`http://localhost:3000/asignaturas/${id}`)
        cargarAsignaturas()
    }
}

const asignaturasFiltradas = computed(() => {
    return asignaturas.value.filter(asignatura => {
        const textoBusqueda = busqueda.value.toLowerCase()
        const coincideBusqueda = Object.values(asignatura).some(value =>
            value?.toString().toLowerCase().includes(textoBusqueda)
        )
        const coincideProfesor = !filtroProfesor.value || (asignatura.profesor?.id === filtroProfesor.value)
        const coincideEstado = !filtroEstado.value || (asignatura.estado === filtroEstado.value)
        return coincideBusqueda && coincideProfesor && coincideEstado;
    })
})

onMounted(cargarAsignaturas)
</script>
