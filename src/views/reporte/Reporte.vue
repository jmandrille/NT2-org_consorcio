<template>
  <div class="reporte">
    <h1>Por estado</h1>
    <chart v-if="ready" :chart-data="stateChartData" :options="options"></chart>
    <h1 class="mt-5">Por categoria</h1>
    <chart v-if="ready" :chart-data="categoryChartData" :options="options"></chart>
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
        console.log(userId);
        const result = await axios.get("/tasks",{params:{assignedUserId: userId}});
        console.log(result);
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