<template>
    <div class="navbar navbar-expand-lg navbar-light col-2">
        <b-button
        v-b-modal.modal-prevent-closing
        class="col-12"
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
</template>

<script>
import TaskForm from "../models/TaskForm";
import validationResult from "../models/ValidationResult";
import axios from "axios";
import TaskSearchParameters from "../models/TaskSearchParameters";
import Categories from "../models/Categories";

export default {
    name:"add",
    props:['filter','itemsSolicitados'],
    mounted() {
        this.filter(),
        this.itemsSolicitados
    },
    data(){
        return {
            form: new TaskForm(),
            validationResult: new validationResult(),
            categories: Categories.categories
        }
    },
    methods:{
        resetModal: function(){
            this.form = new TaskForm();
            this.validationResult = new validationResult();
        },
        async addTask(){
            let form = this.form;
            this.validationResult={
                validCategory: !this.isNullOrEmpty(form.category),
                validDetail: !this.isNullOrEmpty(form.detail),
                validName: !this.isNullOrEmpty(form.name),
            }
            const valid = this.validationResult.validCategory &&
                        this.validationResult.validDetail &&
                        this.validationResult.validName;
            if(valid) {
                form.ownerID=this.$cookies.get("user")._id;
                form.assignedUserID = 0;
                const respuesta = await axios.post("/tasks", form);
                if(respuesta.status==200){
                    this.hideModal();
                    this.itemsSolicitados.push(respuesta.data);
                    this.searchParameters = new TaskSearchParameters();
                    this.filter();
                }
            }
        },
        async handleOK(bvModalEvt){
            bvModalEvt.preventDefault();
            await this.addTask();
        },
        hideModal() {
            this.$nextTick(() => {
                this.$bvModal.hide('modal-prevent-closing')
            })
        },
        isNullOrEmpty(text) {
            return !text || !text.trim() || text=="";
        },
    }
}
</script>