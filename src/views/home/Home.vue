<template>
  <div id="home" class="container col-12">
    <div class="row">
        <filters :filter="filter"></filters>
        <add :filter="filter" :itemsSolicitados="itemsSolicitados"></add>
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
              <b-button v-b-toggle="'collapse-solicitados-'+ element._id" :variant="categories.filter(item=>item.value==element.category)[0].color">{{element.name}}</b-button>
              <b-collapse :id="'collapse-solicitados-'+ element._id" class="mt-2">
                <b-card :title="element.name" :sub-title="element.detail">
                  <b-form-select class="col-5 float-left" v-model="element.assignedUserID" :options="users" @change="edit(element)"></b-form-select>
                  <b-button @click="askForRemove(element._id,element.name)" v-show="isInCharge" variant="danger" class="col-2 float-right"><b-icon icon="trash-fill" aria-hidden="true"></b-icon></b-button>
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
      users: [],
      categories: Categories.categories,
      itemsSolicitados: [],
      itemsEnProceso: [],
      itemsFinalizados: [],
      isInCharge: this.$cookies.get("user").role=="ENCARGADO"
    };
  }, // fin data()
  async created() {
    try {
      this.filter();
      this.initUserOptions();
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
    async getUsers(searchParameters){
      const respuesta = await axios.get("/users",{params: searchParameters});
      return respuesta.data; 
    },
    async initUserOptions(){
      const users = await this.getUsers({});
      let opciones = [{value: 0, text:"Sin asignación"}];
      users.forEach(user => {opciones.push({value: user._id.toString(), text:user.name})});
      this.users = opciones;
    },
    async changeState(event){
      console.log(event);
      const added = event.added;
      // valid = valid && added.element.state=="EN PROCESO" && removed.element.state=="SOLICITADO";
      if(added != null){
        const element = added.element;
        const id = element._id
        const tasks = await this.getTasks({id: id});
        const currentState = tasks[0].state;
        const state = this.decideState(id);
        const valid = this.validateChangeState(currentState, state);
        console.log(valid)
        if(valid){
          element.state=state;
          this.edit(element);
        } else {
         const modal = this.showConfirmationModal('No se puede mover la tarea en esa dirección', 'Error','OK', 'Cancelar')
         modal.then(value => {console.log(value);this.filter()});
        }
      } 
    },
    showConfirmationModal(text, title, okText, cancelText){
      return this.$bvModal.msgBoxConfirm(text, {
        title: title,
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: okText,
        cancelTitle: cancelText,
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
    },
    validateChangeState(currentState, changingState){
      console.log(currentState);
      console.log(changingState);
      let valid = currentState != changingState;
      valid = valid && currentState == "SOLICITADO" && changingState == "EN PROCESO";
      valid = valid || (currentState == "EN PROCESO" && changingState == "FINALIZADO");
      return valid;
    },
    async edit(element){
      return await axios.patch("/tasks/"+element._id, element);
    },
    async askForRemove(id, name){
      console.log(id);
      const modal = this.showConfirmationModal('¿Desea eliminar la tarea ' + name + '?', 'Confirmar eliminación', 'Si','No')
      modal.then(remove => {
        if(remove){
          this.remove(id);
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    async remove(id){
      return await axios.delete("/tasks/" + id);
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
