<template>
  <div id="home" class="container col-12">
    <div class="row">
        <filters :filter="filter"></filters>
        <add :filter="filter" :itemsSolicitados="itemsSolicitados"></add>
    </div>
    <div class="row">
        <b-form-group class="col-12" label-align="left" label-for="category-search-parameter">
          <b-button-group class="col-2 float-left">
            <b-button :pressed.sync="toggleCreated" @click="filterMyOwned()" variant="primary">Creadas</b-button>
            <b-button :pressed.sync="toggleAssigned" @click="filterMyAssigned()" variant="primary">Asignadas</b-button>
          </b-button-group>
        </b-form-group>
    </div>
    <div class="row">
      <div class="col-4">
        <column :items="itemsSolicitados" title="Solicitados" :getTasks="getTasks" :filter="filter" :resolveState="resolveState"></column>
      </div>

      <div class="col-4">
        <column :items="itemsEnProceso" title="En proceso" :getTasks="getTasks" :filter="filter" :resolveState="resolveState"></column>
      </div>

      <div class="col-4">
        <column :items="itemsFinalizados" title="Finalizados" :getTasks="getTasks" :filter="filter" :resolveState="resolveState"></column>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <b-badge class="mr-2" variant="primary">Limpieza: 10</b-badge>
        <b-badge class="mr-2" variant="success">Seguridad: 30</b-badge>
        <b-badge variant="warning">Mantenimiento: 50</b-badge>
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
      toggleAssigned: false,
      toggleCreated: false,
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
      console.log(searchParameters)
      const items = await this.getTasks(searchParameters);
      this.itemsSolicitados = items.filter(item => item.state==="SOLICITADO");
      this.itemsEnProceso = items.filter(item => item.state==="EN PROCESO");
      this.itemsFinalizados = items.filter(item => item.state==="FINALIZADO");
    },
    async getTasks(searchParameters) {
      const respuesta = await axios.get("/tasks",{params: searchParameters});
      return respuesta.data; 
    }, 
    async filterMyAssigned(){
      const userID = this.$cookies.get("user") != null ? this.$cookies.get("user")._id : null
      if(this.toggleAssigned){
        this.itemsSolicitados = this.itemsSolicitados.filter(item => item.assignedUserID == userID);
        this.itemsEnProceso = this.itemsEnProceso.filter(item => item.assignedUserID == userID);
        this.itemsFinalizados = this.itemsFinalizados.filter(item => item.assignedUserID == userID);
      } else{
        this.filter()
      }
    },
    async filterMyOwned(){
      const userID = this.$cookies.get("user") != null ? this.$cookies.get("user")._id : null
      if(this.toggleCreated){
        this.itemsSolicitados = this.itemsSolicitados.filter(item => item.ownerID == userID);
        this.itemsEnProceso = this.itemsEnProceso.filter(item => item.ownerID == userID);
        this.itemsFinalizados = this.itemsFinalizados.filter(item => item.ownerID == userID);
      } else{
        this.filter()
      }
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
