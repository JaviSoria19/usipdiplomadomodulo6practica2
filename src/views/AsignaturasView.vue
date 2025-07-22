<template>
    <div class="container mt-4">
        <h2 class="mb-4 fw-bold">← Gestión de Asignaturas →</h2>

        <!-- Búsqueda -->
        <h3 class="mb-4 fw-bold text-start"><i class="fas fa-search"></i> Búsqueda:</h3>
        <div class="row mb-3">
            <div class="col-md-6">
                <input type="text" v-model="busqueda" class="form-control"
                    placeholder="Buscar asignatura, abreviatura, estado, profesor..." />
            </div>
            <div class="col-md-6 text-end">
                <button class="btn btn-success" @click="abrirModal()"><i class="fas fa-book"></i> Crear
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
                    <th>Estado</th>
                    <th>Profesor</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(asignatura, index) in asignaturasFiltradas" :key="asignatura.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ asignatura.nombreAsignatura }}</td>
                    <td>{{ asignatura.abreviatura }}</td>
                    <td>{{ asignatura.estado }}</td>
                    <td>
                        <span v-if="asignatura.profesor?.user">
                            {{ asignatura.profesor.user.nombres }} {{ asignatura.profesor.user.apellidoPaterno }}
                        </span>
                        <span v-else class="text-muted">Sin asignar</span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-warning me-1" @click="abrirModal(asignatura)"><i class="fas fa-pen"></i>
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
import AsignaturaFormModal from '@/components/AsignaturaFormModal.vue'

const asignaturas = ref([])
const profesores = ref([])

const mostrarModal = ref(false)
const modoEdicion = ref(false)
const asignaturaEditada = ref(null)

const busqueda = ref('')

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
    const texto = busqueda.value.toLowerCase()
    return asignaturas.value.filter(asignatura =>
        asignatura.nombreAsignatura.toLowerCase().includes(texto) ||
        asignatura.abreviatura.toLowerCase().includes(texto) ||
        asignatura.estado.toLowerCase().includes(texto) ||
        asignatura.profesor?.user?.nombres.toLowerCase().includes(texto) ||
        asignatura.profesor?.user?.apellidoPaterno.toLowerCase().includes(texto)
    )
})

onMounted(cargarAsignaturas)
</script>
