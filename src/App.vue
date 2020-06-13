<template>
  <!-- version 0.1.0
un solo template general
marcados con comentarios los que seran pasados a componentes  -->
  <div class="container mt-5">
    <!-- HEADER-->
    <nav
      id="header"
      class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top"
    >
      <div class="container">
        <a class="navbar-brand" href="#">
          <img width="45px" height="45px" src="./assets/logo2.png" alt="tc4" />
          TheConsortium4
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbar"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbar">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a class="nav-link" href="">Usuario</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Encargado</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <!-- HEADER -->
    <div class="row justify-content-center">
      <!-- Esto debiera pasarse a algo tipo SIDEBAR 
      Ver opcion de personalizar los botones -->
      <div class="col-3 mt-5">
        <div class="row p-2 alert alert-secondary">
          <b-button
            v-b-modal.modal-1
            block
            pill
            class="p-2 m-1"
            @click="add"
            variant="primary"
            >+ Agregar tarea</b-button
          >
          <b-modal id="modal-1" title="Nueva tarea"> </b-modal>
          <b-button block pill class="p-2 m-1" @click="add" variant="primary"
            >+ Generar reporte</b-button
          >
          <b-button block pill class="p-2 m-1" @click="add" variant="primary"
            >+ Historial</b-button
          >
          <b-button block pill class="p-2 m-1" @click="add" variant="primary"
            >+ Mantenimiento</b-button
          >
          <b-button block pill class="p-2 m-1" @click="add" variant="primary"
            >+ Limpieza</b-button
          >
          <b-button block pill class="p-2 m-1" @click="add" variant="primary"
            >+ Seguridad</b-button
          >
        </div>
      </div>

      <div class="col-3 mt-5">
        <div class="p-2 alert alert-secondary ">
          <h3 class="text-center">Solicitado</h3>
          <hr />
          <!-- lista items solicitados -->
          <draggable
            class="list-group kanban-column"
            :list="listaItems"
            group="tasks"
          >
            <div
              class="list-group-item"
              v-for="element in listaItems"
              :key="element.name"
            >
              {{ element.name }}
            </div>
          </draggable>
          <hr />
          <div class="row justify-content-center">
            <div class="form-inline">
              <b-form-input
                id="input-2"
                v-model="nuevoItem"
                required
                placeholder="Ingrese tarea aquí"
                @keyup.enter="agregarItem"
              >
              </b-form-input>
              <b-button @click="agregarItem" variant="primary" class="ml-2"
                >+</b-button
              >
            </div>
          </div>
        </div>
      </div>

      <div class="col-3 mt-5">
        <div class="p-2 alert alert-secondary">
          <h3 class="text-center">En proceso</h3>
          <hr />
          <!-- listado items en proceso -->
          <draggable
            class="list-group kanban-column"
            :list="itemsEnProceso"
            group="tasks"
          >
            <div
              class="list-group-item"
              v-for="element in itemsEnProceso"
              :key="element.name"
            >
              {{ element.name }}
            </div>
          </draggable>
        </div>
      </div>

      <div class="col-3 mt-5">
        <div class="p-2 alert alert-secondary">
          <h3 class="text-center">Finalizado</h3>
          <hr />
          <!-- listado items en estado finalizado -->
          <draggable
            class="list-group kanban-column"
            :list="itemsFinalizados"
            group="tasks"
          >
            <div
              class="list-group-item"
              v-for="element in itemsFinalizados"
              :key="element.name"
            >
              {{ element.name }}
            </div>
          </draggable>
        </div>
      </div>
    </div>
    <!-- FOOTER -->
    <footer id="footer" class="pb-4 pt-4">
      <div class="container">
        <div class="text-center align-items-center">
          <h6>© TheConsortium4 - 2020</h6>
          <small>- Todos los derechos reservados - </small>
        </div>
      </div>
    </footer>
    <!-- /FOOTER -->
  </div>
</template>

<script>
//importo draggable
import draggable from "vuedraggable";

export default {
  name: "kanban-board",
  components: {
    //importo draggable como componente
    draggable
  },
  data() {
    return {
      // nueva item
      nuevoItem: "",
      // lista de items
      listaItems: [{ name: "Vayanse" }, { name: "a" }, { name: "la" }],
      itemsEnProceso: [],
      itemsFinalizados: []
    };
  }, // fin data()
  methods: {
    // metodo para agregar un item a listaItems
    agregarItem: function() {
      if (this.nuevoItem) {
        this.listaItems.push({ name: this.nuevoItem });
        this.nuevoItem = ""; // lo vacio dsp de pushearlo
      }
    }
  }
};
</script>

<style>
/* lo minimo para primera presentacion */
.kanban-column {
  min-height: 300px;
}
</style>
