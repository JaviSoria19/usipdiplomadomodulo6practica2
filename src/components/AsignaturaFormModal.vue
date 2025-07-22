<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="guardar">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">{{ modoEdicion ? 'Editar Asignatura' : 'Nueva Asignatura' }}</h5>
            <button type="button" class="btn-close" @click="$emit('cerrar')"></button>
          </div>
          <div class="modal-body fw-bold text-start">
            <div class="mb-3">
              <label class="form-label">Nombre de la Asignatura</label>
              <input v-model="form.nombreAsignatura" type="text" class="form-control" placeholder="Nombre" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Abreviatura</label>
              <input v-model="form.abreviatura" type="text" class="form-control" placeholder="Abreviatura" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Profesor</label>
              <select v-model="form.profesorId" class="form-select" required>
                <option disabled value="">Selecciona profesor</option>
                <option v-for="p in profesores" :key="p.id" :value="p.id">
                  {{ p.user?.nombres }} {{ p.user?.apellidoPaterno }}
                </option>
              </select>
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
            <button class="btn btn-secondary" type="button" @click="$emit('cerrar')"><i class="fas fa-xmark"></i>
              Cancelar</button>
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
  asignaturaEditada: Object,
  profesores: Array
})
const emit = defineEmits(['cerrar', 'guardar'])

const form = ref({
  nombreAsignatura: '',
  abreviatura: '',
  estado: 'ACTIVO',
  profesorId: null
})

watch(() => props.asignaturaEditada, (nueva) => {
  if (props.modoEdicion && nueva) {
    form.value = {
      id: nueva.id,
      nombreAsignatura: nueva.nombreAsignatura,
      abreviatura: nueva.abreviatura,
      estado: nueva.estado,
      profesorId: nueva.profesorId
    }
  } else {
    form.value = {
      nombreAsignatura: '',
      abreviatura: '',
      estado: 'ACTIVO',
      profesorId: null
    }
  }
}, { immediate: true })

const guardar = async () => {
  if (props.modoEdicion) {
    await axios.put(`/asignaturas/${form.value.id}`, form.value)
  } else {
    await axios.post('/asignaturas', form.value)
  }
  emit('cerrar')
  emit('guardar')
}
</script>
