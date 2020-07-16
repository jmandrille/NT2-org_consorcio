<template>
  <div id="home" class="container col-12">
    <div class="row">
        <filters :filter="filter"></filters>
        <add :filter="filter" :itemsSolicitados="itemsSolicitados"></add>
    </div>
    <div class="row">
      <div class="col-4 mt-5">
        <column :items="itemsSolicitados" title="Solicitados" :getTasks="getTasks" :filter="filter" :resolveState="resolveState"></column>
      </div>

      <div class="col-4 mt-5">
        <column :items="itemsEnProceso" title="En proceso" :getTasks="getTasks" :filter="filter" :resolveState="resolveState"></column>
      </div>

      <div class="col-4 mt-5">
        <column :items="itemsFinalizados" title="Finalizados" :getTasks="getTasks" :filter="filter" :resolveState="resolveState"></column>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <b-badge class="mr-2" variant="primary">Limpieza</b-badge>
        <b-badge class="mr-2" variant="success">Seguridad</b-badge>
        <b-badge variant="warning">Mantenimiento</b-badge>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import filters from "./Filters"
import add from './Add';
import column from './Column';

export default {
  name: "Home",
  components: {
    filters,
    add,
    column
  },
  data() {
    return {
      itemsSolicitados: [],
      itemsEnProceso: [],
      itemsFinalizados: [],
    };
  }, 
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
    resolveState(id){
      let state ="SOLICITADO";
      if(this.itemsEnProceso.filter(item => item._id===id).length > 0){
          state="EN PROCESO";
      }else if(this.itemsFinalizados.filter(item => item._id===id).length > 0){
          state="FINALIZADO";
      }
      return state;
    }
  }
};
</script>

<style>
  .kanban-column {
    min-height: 300px;
  }
</style>
