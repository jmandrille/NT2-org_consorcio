<template>
  <div class="reporte col-12">
    <div class="col-6 float-left">
      <h1>Por estado</h1>
      <chart v-if="ready" :chart-data="stateChartData" :options="options"></chart>
    </div>
    <div class="col-6 float-right">
      <h1>Por categoria</h1>
      <chart v-if="ready" :chart-data="categoryChartData" :options="options"></chart>
    </div>
  </div>
</template>

<script>
  import chart from "./Chart"
  import axios from "axios"
  export default {
    name:"reporte",
    components:{ chart },
    data(){
      return {
        ready:false,
        options: {
          responsive: true, 
          maintainAspectRatio: false, 
          animation: {
            animateRotate: false
          }
        },
        chartData:null
      }
    },
    async created(){
      await this.initChartData()
    },
    methods:{
      async initChartData(){
        const userId = this.$cookies.get("user")._id;
        const result = await axios.get("/tasks",{params:{assignedUserId: userId}});
        const totalTasks = result.data;
        const solicitadas = this.filterState(totalTasks,"SOLICITADO");
        const enProceso = this.filterState(totalTasks, "EN PROCESO"); 
        const finalizadas = this.filterState(totalTasks, "FINALIZADO");
        const limpieza = this.filterCategory(totalTasks,"limpieza");
        const seguridad = this.filterCategory(totalTasks,"seguridad");
        const mantenimiento = this.filterCategory(totalTasks,"mantenimiento");
        this.stateChartData={
          labels:['Solicitadas', 'En proceso', 'Finalizadas'],
          datasets: [
            {
              backgroundColor: ['red','yellow','green'],
              data: [solicitadas.length, enProceso.length, finalizadas.length]
            }
          ]
        };
        this.categoryChartData={
          labels:['Limpieza', 'Seguridad', 'Mantenimiento'],
          datasets: [
            {
              backgroundColor: ['blue','green','yellow'],
              data: [limpieza.length, seguridad.length, mantenimiento.length]
            }
          ]
        };
        this.ready=true;
        return result;
      },
      filterState(totalTasks, state){
        return totalTasks.filter(task => task.state == state);
      },
      filterCategory(totalTasks, category){
        return totalTasks.filter(task => task.category == category);
      }
    }
  }
</script>