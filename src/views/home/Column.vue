<template>
    <div class="p-2 alert alert-secondary">
        <h3 class="text-center">{{title}}</h3>
        <hr />
        <draggable
        class="list-group kanban-column"
        :list="items"
        group="tasks"
        @change="changeState"
        >
        <div class="list-group-item mt-2" v-for="element in items" :key="element.name">
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
</template>

<script>
import draggable from 'vuedraggable'
import moment from "moment";
import Categories from '../models/Categories';
import axios from "axios";
moment.locale('es')

export default {
    name: "Home",
    components: {
        draggable
    },
    data(){
        return{
            categories: Categories.categories,
            isInCharge: this.$cookies.get("user").role=="ENCARGADO",
            users: [],
        }
    },
    async created() {
        try {
            this.initUserOptions();
        } catch (error) {
            console.log("ERROR", error)
        }
    },
    props:['items','title','getTasks','filter','resolveState'],
    mounted() {
        this.items,
        this.title,
        this.getTasks(),
        this.filter(),
        this.resolveState()
    },
    methods:{
        async changeState(event){
            console.log(event);
            const added = event.added;
            if(added != null){
                const element = added.element;
                const id = element._id
                const tasks = await this.getTasks({id: id});
                const currentState = tasks[0].state;
                const state = this.resolveState(id);
                const valid = this.validateChangeState(currentState, state, element.assignedUserID);
                console.log(valid)
                if(valid){
                    element.state=state;
                    this.edit(element);

                } else {
                    const modal = this.showConfirmationModal('No se puede mover la tarea en esa dirección. Verificar también si ha sido asignada.', 'Error','OK', 'Cancelar')
                    modal.then(value => {console.log(value);this.filter()});
                }
            } 
        },
        parseMoment(element){
            return moment(element.creationDate).fromNow();
        },
        validateChangeState(currentState, changingState, assignedUserID){
            let valid = currentState != changingState;
            valid = valid && assignedUserID != 0;
            valid = valid && currentState == "SOLICITADO" && changingState == "EN PROCESO";
            valid = valid || (currentState == "EN PROCESO" && changingState == "FINALIZADO");
            return valid;
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
        async initUserOptions(){
            const users = await this.getUsers({});
            let opciones = [{value: 0, text:"Sin asignación"}];
            users.forEach(user => {opciones.push({value: user._id.toString(), text:user.name})});
            this.users = opciones;
        },
        async getUsers(searchParameters){
            const respuesta = await axios.get("/users",{params: searchParameters});
            return respuesta.data; 
        },
        async askForRemove(id, name){
            const modal = this.showConfirmationModal('¿Desea eliminar la tarea ' + name + '?', 'Confirmar eliminación', 'Si','No')
            modal.then(async remove => {
                if(remove){
                    await this.remove(id);
                    this.filter();
                }
            }).catch(err => {
                console.log(err);
            })
        },
        async edit(element){
            return await axios.patch("/tasks/"+element._id, element);
        },
        async remove(id){
            return await axios.delete("/tasks/" + id);
        },
    }
}
</script>