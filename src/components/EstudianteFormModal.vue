<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="guardar">
          <div class="modal-header">
            <h5 class="modal-title">{{ modoEdicion ? 'Editar Estudiante' : 'Nuevo Estudiante' }}</h5>
            <button type="button" class="btn-close" @click="$emit('cerrar')"></button>
          </div>
          <div class="modal-body fw-bold text-start">
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label">Estudiante</label>
                <select v-model="form.userId" class="form-select" required>
                  <option disabled value="">Selecciona estudiante</option>
                  <option v-for="u in usuariosEstudiantes" :key="u.id" :value="u.id">
                    {{ u.nombres }} {{ u.apellidoPaterno }} (CI: {{ u.cedulaIdentidadNumero }})
                  </option>
                </select>
              </div>
              <div class="col-md-12">
                <label class="form-label">Curso</label>
                <select v-model="form.cursoId" class="form-select" required>
                  <option disabled value="">Selecciona curso</option>
                  <option v-for="c in cursos" :key="c.id" :value="c.id">{{ c.nombreCurso }}</option>
                </select>
              </div>
              <div class="col-md-12">
                <label class="form-label">Alergias</label>
                <input v-model="form.saludAlergias" type="text" class="form-control" placeholder="Alergias" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Grupo Sanguíneo</label>
                <select v-model="form.saludGrupoSanguineo" class="form-select" required>
                  <option disabled value="">Grupo sanguíneo</option>
                  <option v-for="grupo in grupos" :key="grupo" :value="grupo">{{ grupo }}</option>
                </select>
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
  estudianteEditado: Object,
  usuariosEstudiantes: Array,
  cursos: Array
})
const emit = defineEmits(['cerrar', 'guardar'])

const grupos = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

const form = ref({
  saludAlergias: '',
  saludGrupoSanguineo: '',
  estado: 'ACTIVO',
  userId: null,
  cursoId: null
})

watch(() => props.estudianteEditado, (nuevo) => {
  if (props.modoEdicion && nuevo) {
    form.value = {
      id: nuevo.id,
      saludAlergias: nuevo.saludAlergias,
      saludGrupoSanguineo: nuevo.saludGrupoSanguineo,
      estado: nuevo.estado,
      userId: nuevo.userId,
      cursoId: nuevo.cursoId
    }
  } else {
    form.value = {
      saludAlergias: '',
      saludGrupoSanguineo: '',
      estado: 'ACTIVO',
      userId: null,
      cursoId: null
    }
  }
}, { immediate: true })

const guardar = async () => {
  if (props.modoEdicion) {
    await axios.put(`/estudiantes/${form.value.id}`, form.value)
  } else {
    await axios.post('/estudiantes', form.value)
  }
  emit('cerrar')
  emit('guardar')
}
</script>
