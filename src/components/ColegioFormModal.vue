<template>
    <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="guardar">
                    <div class="modal-header">
                        <h5 class="modal-title fw-bold">{{ modoEdicion ? 'Editar Colegio' : 'Nuevo Colegio' }}</h5>
                        <button type="button" class="btn-close" @click="$emit('cerrar')"></button>
                    </div>
                    <div class="modal-body fw-bold text-start">
                        <div class="mb-3">
                            <label class="form-label">Nombre</label>
                            <input v-model="form.nombreColegio" type="text" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Dirección</label>
                            <input v-model="form.direccion" type="text" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Teléfono</label>
                            <input v-model="form.telefono" type="text" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Sitio Web</label>
                            <input v-model="form.sitioWeb" type="text" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Estado</label>
                            <select v-model="form.estado" class="form-select" required>
                                <option>ACTIVO</option>
                                <option>INACTIVO</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" type="button" @click="$emit('cerrar')"><i class="fas fa-xmark"></i> Cancelar</button>
                        <button class="btn btn-primary" type="submit"><i class="fas fa-save"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from '../axios'

const props = defineProps({
    mostrar: Boolean,
    modoEdicion: Boolean,
    colegioEditado: Object
})
const emit = defineEmits(['cerrar', 'guardar'])

const form = ref({
    nombreColegio: '',
    direccion: '',
    telefono: '',
    sitioWeb: '',
    estado: 'ACTIVO'
})

watch(() => props.colegioEditado, (nuevo) => {
    if (props.modoEdicion && nuevo) {
        form.value = { ...nuevo }
    } else {
        form.value = {
            nombreColegio: '',
            direccion: '',
            telefono: '',
            sitioWeb: '',
            estado: 'ACTIVO'
        }
    }
}, { immediate: true })

const guardar = async () => {
    if (props.modoEdicion) {
        await axios.put(`/colegios/${form.value.id}`, form.value)
    } else {
        await axios.post('/colegios', form.value)
    }
    emit('cerrar')
    emit('guardar')
}
</script>
