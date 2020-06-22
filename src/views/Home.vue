<template>
  <div id="home" class="container col-12">
    <div class="row">
      <nav
        id="header"
        class="navbar navbar-expand-lg navbar-light col-12"
        style="background-color: #FFFFFF;"
      >
        <div class="container col-12">
          <div class="form-inline">
            <b-form-input
              id="input-2"
              v-model="nuevoItem"
              required
              placeholder="Ingrese tarea aquí"
              @keyup.enter="agregarItem"
            ></b-form-input>
            <b-button @click="agregarItem" variant="outline-info" class="ml-2"
              >Agregar</b-button
            >
          </div>
          <form class="form-inline">
            <input
              class="form-control mr-sm-2"
              type="search"
              placeholder="Nombre Tarea"
              aria-label="Search"
              required
            />
            <button class="btn btn-outline-info my-2 my-sm-0" type="submit">
              Buscar Tarea
            </button>
          </form>
          <b-button
            v-b-modal.modal-1-prevent-closing
            class="p-2 m-1"
            type="submit"
            variant="outline-info"
            @click="add"
            >Agregar Tarea</b-button
          >
          <b-modal
            id="modal-1-prevent-closing"
            ref="modal"
            title="Nueva tarea"
            variant="secondary"
            @show="resetModal"
            @hidden="resetModal"
            @ok="agregarItem"
          >
            <form ref="form" @submit.stop.prevent="agregarItem">
              <b-form-group
                :state="nameState"
                label="Título tarea"
                label-for="name-input"
                invalid-feedback="Título es requerido"
              >
                <b-form-input
                  id="name-input"
                  v-model="name"
                  :state="nameState"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                :state="descripcionState"
                label="Descripción"
                label-for="descripcion-input"
                invalid-feedback="Descripción es requerido"
              >
                <b-form-input
                  id="descripcion-input"
                  v-model="descripcion"
                  :state="descripcionState"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="Categoría"
                label-for="categoria-input"
                invalid-feedback="Categoría es requerido"
              >
                <b-form-select
                  v-model="selected"
                  :options="options"
                ></b-form-select>
              </b-form-group>
            </form>
          </b-modal>

          <b-dropdown
            block
            class="p-2 m-1"
            @click="add"
            text="Filtrar por Categorías"
            variant="outline-info"
          >
            <b-dropdown-item variant="primary">Mantenimiento</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item variant="success">Seguridad</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item variant="warning">Limpieza</b-dropdown-item>
          </b-dropdown>
        </div>
      </nav>
    </div>
    <div class="row">
      <div class="col-4 mt-5">
        <div class="p-2 alert alert-secondary">
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
      //categorias
      selected: null,
      options: [
        { value: "limpieza", text: "Limpieza" },
        { value: "seguridad", text: "Seguridad" },
        { value: "mantenimiento", text: "Mantenimiento" }
      ],
      // lista de items
      listaItems: [
        { name: "Tarea 1" },
        { name: "Tarea 2" },
        { name: "Tarea 3" }
      ],
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
      this.$router.push({ name: "Historico" });
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
