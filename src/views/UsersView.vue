<template>
    <div class="container mt-4">
        <h2 class="mb-4 fw-bold">← Gestión de Usuarios →</h2>

        <!-- Filtro y Búsqueda -->
        <h3 class="mb-4 fw-bold text-start"><i class="fas fa-filter"></i> Filtros y <i class="fas fa-search"></i>
            Búsqueda:</h3>
        <div class="row mb-3">
            <div class="col-md-5">
                <input type="text" class="form-control" placeholder="Buscar..." v-model="searchTerm" />
            </div>
            <div class="col-md-2">
                <select class="form-select" v-model="filtroExpedido">
                    <option value="">Todos los Dptos.</option>
                    <option>LP</option>
                    <option>CB</option>
                    <option>OR</option>
                    <option>SC</option>
                    <option>BN</option>
                    <option>PA</option>
                    <option>PT</option>
                    <option>CH</option>
                    <option>TJ</option>
                </select>
            </div>
            <div class="col-md-3">
                <select class="form-select" v-model="filtroPerfil">
                    <option value="">Todos los perfiles</option>
                    <option>ADMINISTRADOR</option>
                    <option>PROFESOR</option>
                    <option>ESTUDIANTE</option>
                </select>
            </div>
            <div class="col-md-2">
                <button class="btn btn-success w-100" @click="abrirCrear"><i class="fas fa-users"></i> Nuevo Usuario</button>
            </div>
        </div>

        <!-- Tabla -->
        <h3 class="mb-4 fw-bold text-start"><i class="fas fa-table"></i> Registros:</h3>
        <table class="table table-bordered table-striped">
            <thead class="table-light">
                <tr>
                    <th>#</th>
                    <th>CI</th>
                    <th>Nombre completo</th>
                    <th>Perfil</th>
                    <th>Estado</th>
                    <th class="text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in usersFiltrados" :key="user.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ user.cedulaIdentidadNumero }} {{ user.cedulaIdentidadExpedido }}</td>
                    <td>{{ user.nombres }} {{ user.apellidoPaterno }} {{ user.apellidoMaterno }}</td>
                    <td>{{ user.tipoPerfil }}</td>
                    <td>{{ user.estado }}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-warning me-2" @click="abrirEditar(user)"><i class="fas fa-pen"></i> Editar</button>
                        <button class="btn btn-sm btn-danger" @click="eliminarUsuario(user.id)"><i class="fas fa-trash"></i> Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal -->
        <UserFormModal v-if="mostrarModal" :mostrar="mostrarModal" :modo-edicion="modoEdicion"
            :usuario-editado="usuarioEditado" @cerrar="cerrarModal" @guardar="cargarUsuarios" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '../axios'
import UserFormModal from '../components/UserFormModal.vue'

const users = ref([])
const mostrarModal = ref(false)
const modoEdicion = ref(false)
const usuarioEditado = ref(null)
const searchTerm = ref('')
const filtroPerfil = ref('')
const filtroExpedido = ref('')

const cargarUsuarios = async () => {
    const { data } = await axios.get('/users')
    users.value = data
}

const usersFiltrados = computed(() => {
    return users.value.filter(u => {
        const texto = searchTerm.value.toLowerCase()
        const coincideTexto = Object.values(u).some(valor =>
            valor.toString().toLowerCase().includes(texto)
        )
        const coincidePerfil = filtroPerfil.value === '' || u.tipoPerfil === filtroPerfil.value
        const coincideExpedido = filtroExpedido.value === '' || u.cedulaIdentidadExpedido === filtroExpedido.value
        return coincideTexto && coincidePerfil && coincideExpedido
    })
})

const abrirCrear = () => {
    usuarioEditado.value = null
    modoEdicion.value = false
    mostrarModal.value = true
}

const abrirEditar = (user) => {
    usuarioEditado.value = { ...user }
    modoEdicion.value = true
    mostrarModal.value = true
}

const cerrarModal = () => {
    mostrarModal.value = false
}

const eliminarUsuario = async (id) => {
    if (confirm('¿Eliminar este usuario?')) {
        await axios.delete(`/users/${id}`)
        cargarUsuarios()
    }
}

onMounted(cargarUsuarios)
</script>
