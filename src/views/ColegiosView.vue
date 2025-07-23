<template>
    <div class="container mt-4">
        <h2 class="mb-4 fw-bold">← Gestión de Colegios →</h2>

        <!-- Búsqueda -->
        <h3 class="mb-4 fw-bold text-start"><i class="fas fa-search"></i> Búsqueda y <i class="fas fa-filter"></i> Filtro:</h3>
        <div class="row mb-3">
            <div class="col-md-8">
                <input type="text" class="form-control" placeholder="Buscar..." v-model="searchTerm" />
            </div>
            <div class="col-md-2">
                <select class="form-select" v-model="filtroEstado">
                    <option value="">Todos los estados</option>
                    <option>ACTIVO</option>
                    <option>INACTIVO</option>
                </select>
            </div>
            <div class="col-md-2">
                <button class="btn btn-success w-100" @click="abrirCrear"><i class="fas fa-school"></i> Nuevo Colegio</button>
            </div>
        </div>

        <!-- Tabla -->
        <h3 class="mb-4 fw-bold text-start"><i class="fas fa-table"></i> Registros:</h3>
        <table class="table table-bordered table-striped">
            <thead class="table-light">
                <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Sitio Web</th>
                    <th>Estado</th>
                    <th class="text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(colegio, index) in colegiosFiltrados" :key="colegio.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ colegio.nombreColegio }}</td>
                    <td>{{ colegio.direccion }}</td>
                    <td>{{ colegio.telefono }}</td>
                    <td>{{ colegio.sitioWeb }}</td>
                    <td>{{ colegio.estado }}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-warning me-2" @click="abrirEditar(colegio)"><i class="fas fa-pen"></i> Editar</button>
                        <button class="btn btn-sm btn-danger" @click="eliminarColegio(colegio.id)"><i class="fas fa-trash"></i> Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal -->
        <ColegioFormModal v-if="mostrarModal" :mostrar="mostrarModal" :modo-edicion="modoEdicion"
            :colegio-editado="colegioEditado" @cerrar="cerrarModal" @guardar="cargarColegios" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '../axios'
import ColegioFormModal from '../components/ColegioFormModal.vue'

const colegios = ref([])
const mostrarModal = ref(false)
const modoEdicion = ref(false)
const colegioEditado = ref(null)
const searchTerm = ref('')
const filtroEstado = ref('')

const cargarColegios = async () => {
    const { data } = await axios.get('/colegios')
    colegios.value = data
}

const colegiosFiltrados = computed(() => {
    const textoBusqueda = searchTerm.value.toLowerCase()
    return colegios.value.filter(colegio => {
        const coincideBusqueda = Object.values(colegio).some(value =>
            value?.toString().toLowerCase().includes(textoBusqueda)
        )
        const coincideEstado = !filtroEstado.value || (colegio.estado === filtroEstado.value)
        return coincideBusqueda && coincideEstado
    })
})

const abrirCrear = () => {
    colegioEditado.value = null
    modoEdicion.value = false
    mostrarModal.value = true
}

const abrirEditar = (colegio) => {
    colegioEditado.value = { ...colegio }
    modoEdicion.value = true
    mostrarModal.value = true
}

const cerrarModal = () => {
    mostrarModal.value = false
}

const eliminarColegio = async (id) => {
    if (confirm('¿Estás seguro de eliminar este colegio?')) {
        await axios.delete(`/colegios/${id}`)
        cargarColegios()
    }
}

onMounted(cargarColegios)
</script>
