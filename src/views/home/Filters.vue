<template>
    <div class="navbar navbar-expand-lg navbar-light col-10">
        <b-form-group class="col-2" label="Nombre" label-align="left" label-for="name-search-parameter">
            <b-form-input
                type="text"
                id="name-search-parameter"
                placeholder="Escriba para buscar..."
                v-model="searchParameters.name"
                @input="filter(searchParameters)"
                @click="filter(searchParameters)"
            >
            </b-form-input>
            <b-spinner v-show="loadingFilterName" label="Spinning"></b-spinner>
        </b-form-group>
        <b-form-group class="col-2" label="Categoria" label-align="left" label-for="category-search-parameter">
            <b-form-select
                id="category-search-parameter"
                v-model="searchParameters.category"
                :options="categories"
                @change="filter(searchParameters)"
            >
            </b-form-select>
        </b-form-group>
        <b-form-group label="Limpiar" label-for="clear-parameters">
            <b-button id="clear-parameters" @click="clear"><b-badge>X</b-badge></b-button>
        </b-form-group>
    </div>
</template>

<script>
import TaskSearchParameters from "../models/TaskSearchParameters";
import Categories from '../models/Categories';

export default {
    name: "filters",
    data() {
        return {
            searchParameters: new TaskSearchParameters(),
            loadingFilterName:false,
            categories: Categories.categories,
            itemsSolicitados: [],
            itemsEnProceso: [],
            itemsFinalizados: []
        }
    },
    props:['filter'],
    mounted() {
        this.filter();
    },
    methods:{
        clear(){
            this.searchParameters = new TaskSearchParameters();
            this.filter();
        },
        isNullOrEmpty(text) {
            return !text || !text.trim() || text=="";
        }
    }
}
</script>