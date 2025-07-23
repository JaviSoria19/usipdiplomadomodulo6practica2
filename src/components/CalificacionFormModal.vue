<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5);">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="guardar">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">{{ modoEdicion ? 'Editar' : 'Nueva' }} Calificación</h5>
            <button type="button" class="btn-close" @click="$emit('cerrar')"></button>
          </div>
          <div class="modal-body fw-bold text-start">
            <div class="mb-3">
              <label class="form-label">Estudiante</label>
              <select v-model="form.estudianteId" class="form-select" required>
                <option disabled value="">Seleccione...</option>
                <option
                  v-for="e in estudiantes"
                  :key="e.id"
                  :value="e.id"
                >
                  {{ e.user.apellidoPaterno }} {{ e.user.apellidoMaterno }} {{ e.user.nombres }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Asignatura</label>
              <select v-model="form.asignaturaId" class="form-select" required>
                <option disabled value="">Seleccione...</option>
                <option
                  v-for="a in asignaturas"
                  :key="a.id"
                  :value="a.id"
                >
                  {{ a.nombreAsignatura }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Nota</label>
              <input v-model="form.nota" type="number" class="form-control" min="0" max="100" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Gestión</label>
              <input v-model="form.gestion" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Trimestre</label>
              <select v-model="form.trimestre" class="form-select" required>
                <option disabled value="">Seleccione...</option>
                <option value="1">Primer Trimestre</option>
                <option value="2">Segundo Trimestre</option>
                <option value="3">Tercer Trimestre</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('cerrar')"><i class="fas fa-xmark"></i> Cancelar</button>
            <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { toRaw } from 'vue'

const props = defineProps({
  mostrar: Boolean,
  modoEdicion: Boolean,
  calificacionEditada: Object,
  estudiantes: Array,
  asignaturas: Array
})

const emit = defineEmits(['cerrar', 'guardar'])

const form = ref({
  estudianteId: '',
  asignaturaId: '',
  nota: '',
  gestion: '',
  trimestre: ''
})

watch(
  () => props.calificacionEditada,
  (nuevo) => {
    if (nuevo) {
      form.value = {
        estudianteId: nuevo.estudianteId,
        asignaturaId: nuevo.asignaturaId,
        nota: nuevo.nota,
        gestion: nuevo.gestion,
        trimestre: nuevo.trimestre
      }
    } else {
      form.value = {
        estudianteId: '',
        asignaturaId: '',
        nota: '',
        gestion: '',
        trimestre: ''
      }
    }
  },
  { immediate: true }
)

const guardar = async () => {
  const datos = toRaw(form.value)
  if (props.modoEdicion && props.calificacionEditada?.id) {
    await axios.put(`http://localhost:3000/calificaciones/${props.calificacionEditada.id}`, datos)
  } else {
    await axios.post('http://localhost:3000/calificaciones', datos)
  }
  emit('guardar')
  emit('cerrar')
}
</script>
