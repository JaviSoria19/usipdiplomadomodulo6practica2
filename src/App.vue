<template>
  <nav v-if="$route.path !== '/login'" class="bg-primary text-white">
    <router-link to="/" class="bg-warning p-2 rounded"><i class="fas fa-arrow-right-from-bracket"></i> Cerrar Sesión</router-link> | 
    <router-link to="/panel" class="bg-secondary p-2 rounded text-info"><i class="fas fa-grip"></i> Panel</router-link> | 
    <router-link to="/colegios" class="bg-info p-2 rounded"><i class="fas fa-school"></i> Colegios</router-link> |
    <router-link to="/users" class="bg-info p-2 rounded"><i class="fas fa-users"></i> Usuarios</router-link> | 
    <router-link to="/cursos" class="bg-info p-2 rounded"><i class="fas fa-chalkboard"></i> Cursos</router-link> | 
    <router-link to="/profesores" class="bg-info p-2 rounded"><i class="fas fa-chalkboard-teacher"></i> Profesores</router-link> | 
    <router-link to="/estudiantes" class="bg-info p-2 rounded"><i class="fas fa-user-graduate"></i> Estudiantes</router-link> | 
    <router-link to="/asignaturas" class="bg-info p-2 rounded"><i class="fas fa-book"></i> Asignaturas</router-link> | 
    <router-link to="/calificaciones" class="bg-info p-2 rounded"><i class="fas fa-star"></i> Calificaciones</router-link>
  </nav>
  <router-view/>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #ffffff;
    }
  }
}

html {
  position: relative;
  min-height: 100%;
  padding-bottom:100px;
}

body {
  margin-bottom: 100px;
}

footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
}
</style>