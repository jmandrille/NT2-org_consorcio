<template>
  <div id="home" class="container col-12">
    <div class="row">
      <div class="col-4 mt-5">
        <div class="p-2 alert alert-secondary ">
          <h3 class="text-center">Solicitado</h3>
          <hr />
          <!-- lista items solicitados -->
          <draggable
            class="list-group kanban-column"
            :list="listaItems"
            group="tasks">
            <div
              class="list-group-item"
              v-for="element in listaItems"
              :key="element.name">
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

      <div class="col-4 mt-5">
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

      <div class="col-4 mt-5">
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
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "Home",
  components: {
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
    },
    irAHistorico: function() {
      this.$router.push({name:'Historico'}) 
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
