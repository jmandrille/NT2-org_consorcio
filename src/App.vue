<template>
  <div id="app" class="container col-12">
      <div class="row">
        <nav id="header" class="navbar navbar-expand-lg navbar-dark bg-dark col-12">
          <div class="container col-12">
            <a class="navbar-brand" href="#">
              <img width="45px" height="45px" src="./assets/logo2.png" alt="tc4" />
              TheConsortium4
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbar">
              <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                  <router-link class="nav-link" to="/usuario">Usuario</router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/encargado">Encargado</router-link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <div class="row">
        <div class="col-2 mt-5">
          <div class="row p-2 alert alert-secondary">
            <router-link to="/" class="col-12">
              <b-button block pill class="p-2 m-1" variant="primary">Home</b-button>
            </router-link>
            <div class="col-12">
              <b-button v-b-modal.modal-1 block pill class="col-12 p-2 m-1" variant="primary">Agregar tarea</b-button>
              <b-modal id="modal-1" title="Nueva tarea"></b-modal>
            </div>
            <router-link to="/reporte" class="col-12">
              <b-button block pill class="p-2 m-1" variant="primary">Generar reporte</b-button>
            </router-link>
            <router-link to="/historico" class="col-12">
              <b-button block pill class="p-2 m-1" variant="primary">Historico</b-button>
            </router-link>
          </div>
        </div>
        <div class="col-10">
          <router-view />
        </div>
      </div>
      <div class="row">
        <footer id="footer" class="pb-4 pt-4">
          <div class="container fixed-bottom">
            <div class="text-center align-items-center">
              <h6>© TheConsortium4 - 2020</h6>
              <small>- Todos los derechos reservados - </small>
            </div>
          </div>
        </footer>
      </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
