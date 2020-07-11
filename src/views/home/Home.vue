<template>
  <div id="home" class="container col-12">
    <div class="row">
        <filters :filter="filter"></filters>
        <add></add>
    </div>
    <div class="row">
      <div class="col-4 mt-5">
        <div class="p-2 alert alert-secondary">
          <h3 class="text-center">Solicitado</h3>
          <hr />
          <draggable
            class="list-group kanban-column"
            :list="itemsSolicitados"
            group="tasks"
            @change="changeState"
          >
            <div class="list-group-item mt-2" v-for="element in itemsSolicitados" :key="element.name">
              <div class="col-3">
                <b-badge>{{parseMoment(element)}}</b-badge>
              </div>
              <b-button v-b-toggle="'collapse-solicitados-'+ itemsSolicitados.indexOf(element)" :variant="categories.filter(item=>item.value==element.category)[0].color">{{element.name}}</b-button>
              <b-collapse :id="'collapse-solicitados-'+ itemsSolicitados.indexOf(element)" class="mt-2">
                <b-card :title="element.name" :sub-title="element.detail">
                  <b-card-text>
                  </b-card-text>
                  <a href="#" class="card-link">Card link</a>
                  <b-link href="#" class="card-link">Another link</b-link>
                </b-card>
              </b-collapse>
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
            @change="changeState"
          >
            <div class="list-group-item mt-2" v-for="element in itemsEnProceso" :key="element.name">
              <b-button v-b-toggle="'collapse-procesados-'+ itemsEnProceso.indexOf(element)" :variant="categories.filter(item=>item.value==element.category)[0].color">{{element.name}}</b-button>
              <b-collapse :id="'collapse-procesados-'+ itemsEnProceso.indexOf(element)" class="mt-2">
                <b-card :title="element.name" :sub-title="element.detail">
                  <b-card-text>
                  </b-card-text>
                  <a href="#" class="card-link">Card link</a>
                  <b-link href="#" class="card-link">Another link</b-link>
                </b-card>
              </b-collapse>
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
            @change="changeState"
          >
            <div class="list-group-item mt-2" v-for="element in itemsFinalizados" :key="element.name">
              <b-button v-b-toggle="'collapse-finalizados-'+ itemsFinalizados.indexOf(element)" :variant="categories.filter(item=>item.value==element.category)[0].color">{{element.name}}</b-button>
              <b-collapse :id="'collapse-finalizados-'+ itemsFinalizados.indexOf(element)" class="mt-2">
                <b-card :title="element.name" :sub-title="element.detail">
                  <b-card-text>
                  </b-card-text>
                  <a href="#" class="card-link">Card link</a>
                  <b-link href="#" class="card-link">Another link</b-link>
                </b-card>
              </b-collapse>
            </div>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import axios from "axios";
import moment from "moment";
import filters from "./Filters"
import add from './Add';
import Categories from '../models/Categories';
moment.locale('es')

export default {
  name: "Home",
  components: {
    draggable,
    filters,
    add
  },
  data() {
    return {
      categories: Categories.categories,
      itemsSolicitados: [],
      itemsEnProceso: [],
      itemsFinalizados: []
    };
  }, // fin data()
  async created() {
    try {
      this.filter();
    } catch (error) {
      console.log("ERROR", error)
    }
  },
  methods: {
    async filter(searchParameters) {
      const items = await this.getTasks(searchParameters);
      this.itemsSolicitados = items.filter(item => item.state==="SOLICITADO");
      this.itemsEnProceso = items.filter(item => item.state==="EN PROCESO");
      this.itemsFinalizados = items.filter(item => item.state==="FINALIZADO");
    },
    async getTasks(searchParameters) {
      const respuesta = await axios.get("/tasks",{params: searchParameters});
      return respuesta.data; 
    },
    async changeState(event){
      const added = event.added;
      if(event.added != null){
        const element = added.element;
        const state = this.decideState(added.element._id);
        element.state=state;
        const respuesta = await axios.patch("/tasks/"+element._id, element);
        console.log(respuesta);
      }
    },
    decideState(id){
      let state ="SOLICITADO";
      if(this.itemsEnProceso.filter(item => item._id===id).length > 0){
        state="EN PROCESO";
      }else if(this.itemsFinalizados.filter(item => item._id===id).length > 0){
        state="FINALIZADO";
      }
      return state;
    },
    parseMoment(element){
      return moment(element.creationDate).fromNow();
    },
    textIncluded(text1, text2){
      return text1.toLowerCase().includes(text2.toLowerCase());
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
