<template>
  <div class="historico">
    <h1>Historico</h1>
    <b-table striped hover :items="historics"></b-table>

  </div>
</template>
<script>
  import axios from "axios"
  import moment from "moment"
  moment.locale('es')

  export default {
    name:"historico",
    data(){
      return {
        historics:[]
      }
    },
    async created() {
      try {
        this.initHistoric();
      } catch (error) {
        console.log("ERROR", error)
      }
    },
    methods:{
      async initHistoric(){
        const result = await axios.get("/historics");
        console.log(result.data);
        const list = [];
        result.data.forEach(value => list.push({
          Autor: value.author,
          Accion: value.action,
          Descripción: value.description,
          Fecha: this.parseMoment(value.eventDate),
        }));
        this.historics = list;
      },
      parseMoment(element){
        return moment(element.creationDate).fromNow();
      },
    }
  }
</script>