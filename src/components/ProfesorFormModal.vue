<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="guardar">
          <div class="modal-header">
            <h5 class="modal-title">{{ modoEdicion ? 'Editar Profesor' : 'Nuevo Profesor' }}</h5>
            <button type="button" class="btn-close" @click="$emit('cerrar')"></button>
          </div>
          <div class="modal-body fw-bold text-start">
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label">Profesor</label>
                <select v-model="form.userId" class="form-select" required>
                  <option disabled value="">Selecciona un profesor</option>
                  <option v-for="u in usuariosProfesores" :key="u.id" :value="u.id">
                    {{ u.nombres }} {{ u.apellidoPaterno }} (CI: {{ u.cedulaIdentidadNumero }})
                  </option>
                </select>
              </div>
              <div class="col-md-12">
                <label class="form-label">Título Académico</label>
                <input v-model="form.tituloAcademico" type="text" class="form-control" placeholder="Título académico" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Número de celular</label>
                <input v-model="form.numeroCelular" type="text" class="form-control" placeholder="Número de celular" required />
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
import { ref, watch } from 'vue'
import axios from '../axios'

const props = defineProps({
  mostrar: Boolean,
  modoEdicion: Boolean,
  profesorEditado: Object,
  usuariosProfesores: Array
})
const emit = defineEmits(['cerrar', 'guardar'])

const form = ref({
  tituloAcademico: '',
  numeroCelular: '',
  estado: 'ACTIVO',
  userId: null
})

watch(() => props.profesorEditado, (nuevo) => {
  if (props.modoEdicion && nuevo) {
    form.value = {
      id: nuevo.id,
      tituloAcademico: nuevo.tituloAcademico,
      numeroCelular: nuevo.numeroCelular,
      estado: nuevo.estado,
      userId: nuevo.userId
    }
  } else {
    form.value = {
      tituloAcademico: '',
      numeroCelular: '',
      estado: 'ACTIVO',
      userId: null
    }
  }
}, { immediate: true })

const guardar = async () => {
  if (props.modoEdicion) {
    await axios.put(`/profesores/${form.value.id}`, form.value)
  } else {
    await axios.post('/profesores', form.value)
  }
  emit('cerrar')
  emit('guardar')
}
</script>
