<template>
  <div id="home" class="container col-12">
    <div class="row">
      <div class="navbar navbar-expand-lg navbar-light col-12">
        <div class="container col-12">
          <b-form-input
            class="col-2"
            type="text"
            placeholder="Escriba un titulo para buscar..."
            v-model="searchParameters.name"
            @keypress="filterName"
            @keyup="filterName"
            @click="filterName"
          ></b-form-input>
          <div class="col-3">
            <label class="col-6">Filtro por categorias:</label>
            <b-form-select
              class="col-6"
              v-model="searchParameters.category"
              :options="categories"
              @change="filterAll"
            >
            </b-form-select>
          </div>
          <b-button
            v-b-modal.modal-prevent-closing
            class="col-1"
            type="submit"
            variant="outline-info"
            >Agregar Tarea</b-button
          >
          <b-modal
            id="modal-prevent-closing"
            ref="modal"
            title="Nueva tarea"
            variant="secondary"
            @show="resetModal"
            @hidden="resetModal"
            @ok="handleOK"
          >
            <b-form ref="form" @submit.stop.prevent="addTask">
              <b-form-group
                label="Título tarea"
                label-for="name-input"
                invalid-feedback="Título es requerido"
                :state="validationResult.validName"
              >
                <b-form-input
                  id="name-input"
                  v-model="form.name"
                  :state="validationResult.validName"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="Detalles"
                label-for="detail-input"
                invalid-feedback="Detalle es requerido"
                :state="validationResult.validDetail"
              >
                <b-form-input
                  :state="validationResult.validDetail"
                  id="detalle-input"
                  v-model="form.detail"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="Categoría"
                label-for="categoria-input"
                invalid-feedback="Categoría es requerido"
                :state="validationResult.validCategory"
              >
                <b-form-select
                  :state="validationResult.validCategory"
                  v-model="form.category"
                  :options="categories.filter(item => item.value!=null)"
                >

                </b-form-select>
              </b-form-group>
            </b-form>
          </b-modal>
        </div>
      </div>
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
            <div class="list-group-item" v-for="element in itemsSolicitados" :key="element.name">
              <b-button v-b-toggle="'collapse-solicitados-'+ itemsSolicitados.indexOf(element)" :variant="categories.filter(item=>item.value==element.category)[0].color">{{element.name}}</b-button>
              <b-collapse :id="'collapse-solicitados-'+ itemsSolicitados.indexOf(element)" class="mt-2">
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
          <h3 class="text-center">En proceso</h3>
          <hr />
          <!-- listado items en proceso -->
          <draggable
            class="list-group kanban-column"
            :list="itemsEnProceso"
            group="tasks"
            @change="changeState"
          >
            <div class="list-group-item" v-for="element in itemsEnProceso" :key="element.name">
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
            <div class="list-group-item" v-for="element in itemsFinalizados" :key="element.name">
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
import draggable from "vuedraggable";
import axios from "axios";
import TaskForm from "./models/TaskForm";
import TaskSearchParameters from "./models/TaskSearchParameters";
import validationResult from "./models/ValidationResult";

export default {
  name: "Home",
  components: {
    draggable
  },
  data() {
    return {
      searchParameters: new TaskSearchParameters(),
      form: new TaskForm(),
      validationResult: new validationResult(),
      categories: [
        { value:null, text:"Todos"},
        { value: "limpieza", text: "Limpieza", color:"primary"},
        { value: "seguridad", text: "Seguridad", color:"success"},
        { value: "mantenimiento", text: "Mantenimiento", color:"warning"}
      ],
      itemsSolicitados: [],
      itemsEnProceso: [],
      itemsFinalizados: []
    };
  }, // fin data()
  async created() {
    try {
      this.filterAll();
    } catch (error) {
      console.log("ERROR", error)
    }
  },
  methods: {
    async filterAll() {
      const items = await this.getTasks();
      this.itemsSolicitados = items.filter(item => item.state==="SOLICITADO");
      this.itemsEnProceso = items.filter(item => item.state==="EN PROCESO");
      this.itemsFinalizados = items.filter(item => item.state==="FINALIZADO");
    },
    async getTasks() {
      console.log(this.searchParameters);
      const respuesta = await axios.get("/tasks",{params:this.searchParameters});
      console.log(respuesta);
      return respuesta.data; 
    },
    async handleOK(bvModalEvt){
      bvModalEvt.preventDefault();
      await this.addTask();
    },
    async addTask(){
      const form = this.form;
      console.log(form);
      this.validationResult={
        validCategory: !this.isNullOrEmpty(form.category),
        validDetail: !this.isNullOrEmpty(form.detail),
        validName: !this.isNullOrEmpty(form.name),
      }
      const valid = this.validationResult.validCategory &&
        this.validationResult.validDetail &&
        this.validationResult.validName;
      if(valid) {
        const respuesta = await axios.post("/tasks", form);
        if(respuesta.status==200){
          this.hideModal();
          this.itemsSolicitados.push(respuesta.data);
          this.searchParameters = new TaskSearchParameters();
          this.filterAll();
        }
      }
    },
    async changeState(event){
      const added = event.added;
      if(event.added != null){
        const element = added.element;
        const state = this.decideState(added.element._id);
        console.log(state);
        element.state=state;
        const respuesta = await axios.patch("/tasks/"+element._id, element);
        console.log(respuesta);
      }
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
    filterName(){
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        if(this.isNullOrEmpty(this.searchParameters.name)){
          this.searchParameters = new TaskSearchParameters();
          this.filterAll();
        }
        const name = this.searchParameters.name;
        this.itemsSolicitados = this.itemsSolicitados.filter(item => this.textIncluded(item.name, name));
        this.itemsEnProceso = this.itemsEnProceso.filter(item => this.textIncluded(item.name, name));
        this.itemsFinalizados = this.itemsFinalizados.filter(item => this.textIncluded(item.name, name));
      }, 100);
    },
    hideModal() {
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })
    },
    isNullOrEmpty(text) {
      return !text || !text.trim();
    },
    textIncluded(text1, text2){
      return text1.includes(text2);
    },
    irAHistorico: function() {
      this.$router.push({ name: "Historico" });
    },
    resetModal: function(){
      this.form = new TaskForm();
      this.validationResult = new validationResult();
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
