<template>
  <div class="historico">
    <h1>Historico</h1>
    <filters :filter="filter"></filters>
    <b-table striped hover :items="historics"></b-table>
    <b-alert :show="showErrorMessage" variant="danger">No hay resultados para la búsqueda</b-alert>
  </div>
</template>
<script>
  import axios from "axios"
  import moment from "moment"
  import filters from "./Filters"
  moment.locale('es')

  export default {
    name:"historico",
    data(){
      return {
        historics:[],
        showErrorMessage:false
      }
    },
    components: {
      filters,
    },
    async created() {
      try {
        this.initHistoric();
      } catch (error) {
        console.log("ERROR", error)
      }
    },
    methods:{
      show(){
        return true
      },
      async initHistoric(){
        const result = await axios.get("/historics");
        this.historics = this.createHistoricList(result.data);
      },
      createHistoricList(originalList){
        const list = [];
        originalList.forEach(value => list.push(this.transformItem(value)));
        return list;
      },
      transformItem(value){
        return {
          Autor: value.author,
          Accion: value.action,
          Descripción: value.description,
          Fecha: this.parseMoment(value.eventDate),
        }
      },
      async filter(searchParameters) {
        const result = await axios.get("/historics",{params: searchParameters});
        this.showErrorMessage = result.data.length == 0;
        this.historics = this.createHistoricList(result.data);
      },
      parseMoment(value){
        return moment(value).fromNow();
      },
    }
  }
</script>