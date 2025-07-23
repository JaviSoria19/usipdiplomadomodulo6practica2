<template>
    <div class="container py-4">
        <h2 class="mb-4 fw-bold">← Gestión de Calificaciones →</h2>

        <!-- Búsqueda -->
        <h3 class="mb-4 fw-bold text-start"><i class="fas fa-search"></i> Búsqueda y <i class="fas fa-filter"></i>
            Filtros:</h3>
        <div class="mb-3 row">
            <div class="col-md-6">
                <input type="text" v-model="busqueda" class="form-control" placeholder="Buscar..." />
            </div>
            <div class="col-md-2">
                <select class="form-select" v-model="filtroAsignatura">
                    <option value="">Todas las asignaturas</option>
                    <option v-for="asignatura in asignaturas" :key="asignatura.id" :value="asignatura.id">
                        {{ asignatura.nombreAsignatura }}</option>
                </select>
            </div>
            <div class="col-md-2">
                <select class="form-select" v-model="filtroTrimestre">
                    <option value="">Todos los trimestres</option>
                    <option value="1">Primer Trimestre</option>
                    <option value="2">Segundo Trimestre</option>
                    <option value="3">Tercer Trimestre</option>
                </select>
            </div>                
            <div class="col-md-2 text-end">
                <button class="btn btn-success" @click="abrirModal()"><i class="fas fa-star"></i> Nueva Calificación</button>
            </div>
        </div>

        <!-- Tabla -->
        <h3 class="mb-4 fw-bold text-start"><i class="fas fa-table"></i> Registros:</h3>
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Estudiante</th>
                    <th>Asignatura</th>
                    <th>Abreviatura</th>
                    <th>Nota</th>
                    <th>Gestión</th>
                    <th>Trimestre</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(calificacion, index) in calificacionesFiltradas" :key="calificacion.id">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <span v-if="calificacion.estudiante?.user">
                            {{ calificacion.estudiante.user.apellidoPaterno }} {{ calificacion.estudiante.user.apellidoMaterno }} {{ calificacion.estudiante.user.nombres }}
                        </span>
                    </td>
                    <td>{{ calificacion.asignatura?.nombreAsignatura || '---' }}</td>
                    <td>{{ calificacion.asignatura?.abreviatura || '---' }}</td>
                    <td>{{ calificacion.nota }}</td>
                    <td>{{ calificacion.gestion }}</td>
                    <td>{{ calificacion.trimestre }}</td>
                    <td>
                        <button class="btn btn-sm btn-warning me-1" @click="abrirModal(calificacion)"><i class="fas fa-pen"></i> Editar</button>
                        <button class="btn btn-sm btn-danger" @click="eliminarCalificacion(calificacion.id)"><i class="fas fa-trash"></i> Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <CalificacionFormModal v-if="mostrarModal" :mostrar="mostrarModal" :modo-edicion="modoEdicion"
            :calificacion-editada="calificacionEditada" :estudiantes="estudiantes" :asignaturas="asignaturas"
            @cerrar="cerrarModal" @guardar="cargarCalificaciones" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import CalificacionFormModal from '../components/CalificacionFormModal.vue'

const calificaciones = ref([])
const estudiantes = ref([])
const asignaturas = ref([])

const busqueda = ref('')
const mostrarModal = ref(false)
const modoEdicion = ref(false)
const calificacionEditada = ref(null)
const filtroAsignatura = ref('')
const filtroTrimestre = ref('')

const cargarCalificaciones = async () => {
    const [resCalificaciones, resEstudiantes, resAsignaturas] = await Promise.all([
        axios.get('http://localhost:3000/calificaciones?_sort=nota&_order=desc'),
        axios.get('http://localhost:3000/estudiantes?_expand=user'),
        axios.get('http://localhost:3000/asignaturas?_sort=nombreAsignatura&_order=asc')
    ])

    calificaciones.value = resCalificaciones.data.map(calificacion => {
        const estudiante = resEstudiantes.data.find(e => e.id === calificacion.estudianteId)
        const asignatura = resAsignaturas.data.find(a => a.id === calificacion.asignaturaId)
        return { ...calificacion, estudiante, asignatura }
    })

    estudiantes.value = resEstudiantes.data
    asignaturas.value = resAsignaturas.data
}

const abrirModal = (cal = null) => {
    modoEdicion.value = !!cal
    calificacionEditada.value = cal ? { ...cal } : null
    mostrarModal.value = true
}

const cerrarModal = () => {
    mostrarModal.value = false
}

const eliminarCalificacion = async id => {
    const confirmacion = confirm('¿Estás seguro de eliminar esta calificación?')
    if (confirmacion) {
        await axios.delete(`http://localhost:3000/calificaciones/${id}`)
        cargarCalificaciones()
    }
}

const calificacionesFiltradas = computed(() => {
    return calificaciones.value.filter(calificacion => {
        const matchesBusqueda = calificacion.estudiante?.user?.nombres.toLowerCase().includes(busqueda.value.toLowerCase()) ||
            calificacion.estudiante?.user?.apellidoPaterno.toLowerCase().includes(busqueda.value.toLowerCase()) ||
            calificacion.estudiante?.user?.apellidoMaterno.toLowerCase().includes(busqueda.value.toLowerCase());

        const coincideAsignatura = !filtroAsignatura.value || calificacion.asignaturaId === filtroAsignatura.value;
        const coincideTrimestre = !filtroTrimestre.value || calificacion.trimestre === filtroTrimestre.value;

        return matchesBusqueda && coincideAsignatura && coincideTrimestre;
    });
})

onMounted(cargarCalificaciones)
</script>
