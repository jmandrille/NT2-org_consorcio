<template>
    <div class="navbar navbar-expand-lg navbar-light col-10">
        <b-form-group class="col-2" label="Descripcion" label-align="left" label-for="name-search-parameter">
            <b-form-input
                type="text"
                id="name-search-parameter"
                placeholder="Escriba para buscar..."
                v-model="searchParameters.description"
                @input="filter(searchParameters)"
                @click="filter(searchParameters)"
            >
            </b-form-input>
            <b-spinner v-show="loadingFilterName" label="Spinning"></b-spinner>
        </b-form-group>
        <b-form-group class="col-2" label="Autor" label-align="left" label-for="autor-search-parameter">
            <b-form-select
                id="autor-search-parameter"
                v-model="searchParameters.author"
                :options="users"
                @change="filter(searchParameters)"
            >
            </b-form-select>
        </b-form-group>
        <b-form-group class="col-2" label="Acción" label-align="left" label-for="accion-search-parameter">
            <b-form-select
                id="accion-search-parameter"
                v-model="searchParameters.action"
                :options="actions"
                @change="filter(searchParameters)"
            >
            </b-form-select>
        </b-form-group>
        <b-form-group label="Limpiar" label-for="clear-parameters">
            <b-button id="clear-parameters" @click="clear"><b-icon-x-circle></b-icon-x-circle></b-button>
        </b-form-group>
    </div>
</template>

<script>
import HistoricSearchParameters from "../models/HistoricSearchParameters";
import Options from '../models/Options';
import axios from "axios"

export default {
    name: "filters",
    data() {
        return {
            searchParameters: new HistoricSearchParameters(),
            loadingFilterName:false,
            actions: Options.actions,
            users: [{value: null,text:"Todos"}]
        }
    },
    // props:['historics'],

    async created(){
        try {
            this.initUsers();
        } catch (error) {
            console.log("ERROR", error)
        }
    },
    props:['filter'],
    mounted() {
        this.filter;
    },
    methods:{
        async initUsers(){
            const respuesta = await axios.get("/users");
            respuesta.data.forEach(user => this.users.push({
                value: user.name, text: user.name
            }));
        },
        clear(){
            this.searchParameters = new HistoricSearchParameters();
            this.filter();
        },
        isNullOrEmpty(text) {
            return !text || !text.trim() || text=="";
        }
    }
}
</script>