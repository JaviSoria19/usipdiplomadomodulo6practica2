<template>
    <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="guardar">
                    <div class="modal-header">
                        <h5 class="modal-title fw-bold">{{ modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario' }}</h5>
                        <button type="button" class="btn-close" @click="$emit('cerrar')"></button>
                    </div>
                    <div class="modal-body fw-bold text-start">
                        <div class="row g-3">
                            <div class="col-md-12">
                                <label class="form-label">Colegio</label>
                                <select v-model="form.colegioId" class="form-select" required>
                                    <option disabled value="">Selecciona un colegio</option>
                                    <option v-for="c in colegios" :key="c.id" :value="c.id">{{ c.nombreColegio }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-12">
                                <label class="form-label">Nombres</label>
                                <input v-model="form.nombres" type="text" class="form-control" placeholder="Nombres"
                                    required />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Apellido Materno</label>
                                <input v-model="form.apellidoPaterno" type="text" class="form-control"
                                    placeholder="Apellido paterno" required />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Apellido Paterno</label>
                                <input v-model="form.apellidoMaterno" type="text" class="form-control"
                                    placeholder="Apellido materno" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Cédula de Identidad</label>
                                <input v-model="form.cedulaIdentidadNumero" type="text" class="form-control"
                                    placeholder="C.I. número" required />
                                
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">C.I. Expedido</label>
                                <select v-model="form.cedulaIdentidadExpedido" class="form-select" required>
                                    <option disabled value="">Expedido</option>
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
                            <div class="col-md-6">
                                <label class="form-label">E-mail</label>
                                <input v-model="form.email" type="text" class="form-control"
                                    placeholder="Email o CI para login" required />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Tipo de Perfil</label>
                                <select v-model="form.tipoPerfil" class="form-select" required>
                                    <option disabled value="">Perfil</option>
                                    <option>ADMINISTRADOR</option>
                                    <option>PROFESOR</option>
                                    <option>ESTUDIANTE</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Contraseña</label>
                                <input v-model="form.password" type="text" class="form-control"
                                    placeholder="Password (solo admin)"
                                    :disabled="form.tipoPerfil !== 'ADMINISTRADOR'" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Estado</label>
                                <select v-model="form.estado" class="form-select" required>
                                    <option>ACTIVO</option>
                                    <option>INACTIVO</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer mt-3">
                        <button class="btn btn-secondary" type="button" @click="$emit('cerrar')"><i class="fas fa-xmark"></i> Cancelar</button>
                        <button class="btn btn-primary" type="submit"><i class="fas fa-save"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from '../axios'

const props = defineProps({
    mostrar: Boolean,
    modoEdicion: Boolean,
    usuarioEditado: Object
})
const emit = defineEmits(['cerrar', 'guardar'])

const form = ref({
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    cedulaIdentidadNumero: '',
    cedulaIdentidadExpedido: '',
    email: '',
    password: 'solo admin',
    tipoPerfil: '',
    estado: 'ACTIVO',
    colegioId: null
})

const colegios = ref([])

const cargarColegios = async () => {
    const { data } = await axios.get('/colegios')
    colegios.value = data
}

watch(() => props.usuarioEditado, (nuevo) => {
    if (props.modoEdicion && nuevo) {
        form.value = { ...nuevo }
    } else {
        form.value = {
            nombres: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            cedulaIdentidadNumero: '',
            cedulaIdentidadExpedido: '',
            email: '',
            password: 'solo admin',
            tipoPerfil: '',
            estado: 'ACTIVO',
            colegioId: null
        }
    }
}, { immediate: true })

const guardar = async () => {
    if (props.modoEdicion) {
        await axios.put(`/users/${form.value.id}`, form.value)
    } else {
        await axios.post('/users', form.value)
    }
    emit('cerrar')
    emit('guardar')
}

onMounted(cargarColegios)
</script>
