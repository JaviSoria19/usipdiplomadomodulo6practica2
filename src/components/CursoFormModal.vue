<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="guardar">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">{{ modoEdicion ? 'Editar Curso' : 'Nuevo Curso' }}</h5>
            <button type="button" class="btn-close" @click="$emit('cerrar')"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nombre del Curso</label>
              <input v-model="form.nombreCurso" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Nivel</label>
              <select v-model="form.nivel" class="form-select" required>
                <option>PRIMARIA</option>
                <option>SECUNDARIA</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Paralelo</label>
              <select v-model="form.paralelo" class="form-select" required>
                <option>A</option>
                <option>B</option>
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
            <button class="btn btn-secondary" type="button" @click="$emit('cerrar')">Cancelar</button>
            <button class="btn btn-primary" type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from '../axios'

import { onMounted } from 'vue'

const props = defineProps({
  mostrar: Boolean,
  modoEdicion: Boolean,
  cursoEditado: Object
})
const emit = defineEmits(['cerrar', 'guardar'])

const form = ref({
  nombreCurso: '',
  nivel: 'PRIMARIA',
  paralelo: 'A',
  estado: 'ACTIVO'
})

watch(() => props.cursoEditado, (nuevo) => {
  if (props.modoEdicion && nuevo) {
    form.value = { ...nuevo }
  } else {
    form.value = {
      nombreCurso: '',
      nivel: 'PRIMARIA',
      paralelo: 'A',
      estado: 'ACTIVO'
    }
  }
}, { immediate: true })

const guardar = async () => {
  if (props.modoEdicion) {
    await axios.put(`http://localhost:3000/cursos/${form.value.id}`, form.value)
  } else {
    await axios.post('http://localhost:3000/cursos', form.value)
  }
  emit('cerrar')
  emit('guardar')
}
</script>
