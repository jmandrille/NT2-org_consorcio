<template>
  <div id="usuario" class="container col-12">
    <h1><b-alert show variant="success">Puntos: {{puntos}}</b-alert></h1>
    <b-list-group>
        <b-list-group-item>
            <h2><b-badge>10% expensas</b-badge></h2>
            <b-button :variant="reachedTop(this.maxPointValues.tenPercent)" class="float-right ml-3" :disabled="checkDisabled(this.maxPointValues.tenPercent)" >Canjear!</b-button>
            <b-progress :variant="reachedTop(this.maxPointValues.tenPercent)" :value="puntos" :max="this.maxPointValues.tenPercent" show-value animated class="mt-3"></b-progress>
            <b-badge class="float-right">{{this.maxPointValues.tenPercent}}</b-badge>
        </b-list-group-item>
        <b-list-group-item>
            <h2><b-badge>25% expensas</b-badge></h2>
            <b-button :variant="reachedTop(this.maxPointValues.twentyFivePercent)" class="float-right ml-3"  :disabled="checkDisabled(this.maxPointValues.twentyFivePercent)">Canjear!</b-button>
            <b-progress :variant="reachedTop(this.maxPointValues.twentyFivePercent)" :value="puntos" :max="this.maxPointValues.twentyFivePercent" show-value animated class="mt-3"></b-progress>
            <b-badge class="float-right">{{this.maxPointValues.twentyFivePercent}}</b-badge>
        </b-list-group-item>
        <b-list-group-item>
            <h2><b-badge>Un viaje a la Antartida</b-badge></h2>
            <b-button :variant="reachedTop(this.maxPointValues.antartics)" class="float-right ml-3"  :disabled="checkDisabled(this.maxPointValues.antartics)" >Canjear!</b-button>
            <b-progress :variant="reachedTop(this.maxPointValues.antartics)" :value="puntos" :max="this.maxPointValues.antartics" show-value animated class="mt-3"></b-progress>
            <b-badge class="float-right">{{this.maxPointValues.antartics}}</b-badge>
        </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
    import axios from "axios";
    export default {
        name: "Usuario",
        data(){ return {
                puntos: 0,
                expensasActuales: 10000,
                maxPointValues:{
                    tenPercent: 25,
                    twentyFivePercent: 75,
                    antartics: 1000
                },
                ready:false
            }
        },
        async created(){
            try {
             this.calcularPuntos();
            } catch (error) {
             console.log("ERROR", error)
            }
        },
        methods:{
            async calcularPuntos(){
                if(this.$cookies.get("user")==null){
                    this.$router.push('/login');
                }
                const searchParameters = {assignedUserID: this.$cookies.get("user")._id};
                const respuesta = await axios.get("/tasks",{params: searchParameters});
                const finalizados = respuesta.data.filter(value => value.state=="FINALIZADO");
                let puntos = 0;
                puntos = puntos + this.filterCategory(finalizados, "limpieza").length * 10;
                puntos = puntos + this.filterCategory(finalizados, "mantenimiento").length * 30;
                puntos = puntos + this.filterCategory(finalizados, "seguridad").length * 50;
                this.puntos = puntos;
                this.ready=true;
            },
            filterCategory(list, category){
                return list.filter(value => value.category == category)
            },
            reachedTop(top){
                let variant = 'danger';
                if(!this.checkDisabled(top)){
                    variant = 'success';
                }
                return variant;
            },
            checkDisabled(top){
                return this.puntos < top;
            }
        }
    }
</script>