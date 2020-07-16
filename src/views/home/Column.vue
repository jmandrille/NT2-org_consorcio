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
            <div class="col-12">
                <b-badge class="col-4 float-left">Creado por: {{findUserNameByID(element.ownerID)}}</b-badge>
                <b-badge class="col-4 float-right">{{parseMoment(element.creationDate)}}</b-badge>
            </div>
            <b-button size="lg" class="mt-4" v-b-toggle="'collapse-solicitados-'+ element._id" :variant="categories.filter(item=>item.value==element.category)[0].color">{{element.name}}</b-button>
            <b-collapse :id="'collapse-solicitados-'+ element._id" class="mt-2">
            <b-card :title="element.detail" >
                <b-form-select :disabled="element.state != 'SOLICITADO'" class="col-5 float-left" v-model="element.assignedUserID" :options="users" @change="edit(element)"></b-form-select>
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
import Options from '../models/Options';
import axios from "axios";
import cron from 'node-cron'
moment.locale('es')

export default {
    name: "Home",
    components: {
        draggable
    },
    data(){
        return{
            categories: Options.categories,
            isInCharge: this.$cookies.get("user").role=="ENCARGADO",
            users: [],
        }
    },
    async created() {
        try {
            this.initUserOptions();
            this.checkDate();
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
        checkDate(){
            cron.schedule('* * * * *', () => {
                this.filter();
            });
        },
        async changeState(event){
            const added = event.added;
            if(added != null){
                const element = added.element;
                const id = element._id
                const tasks = await this.getTasks({id: id});
                const currentState = tasks[0].state;
                const state = this.resolveState(id);
                const valid = this.validateChangeState(currentState, state, element.assignedUserID);
                if(valid){
                    element.state=state;
                    this.edit(element);

                } else {
                    const modal = this.showConfirmationModal('No se puede mover la tarea en esa dirección. Verificar también si ha sido asignada.', 'Error','OK', 'Cancelar')
                    modal.then(value => {console.log(value);this.filter()});
                }
            } 
        },
        parseMoment(date){
            return moment(date).fromNow();
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
        findUserNameByID(id){
            let name = null;
            const filter = this.users.filter(user => user.value == id.toString());
            if(filter.length > 0){
                name = filter[0].text;
            }
            return name;
        },
        async initUserOptions(){
            const users = await this.getUsers({});
            let opciones = [{value: 0, text:"Sin asignación"}];
            const userLoggedIn = this.$cookies.get("user") != null ? this.$cookies.get("user").name : null;
            users.forEach(user => {
                if(user.name!= userLoggedIn){
                    opciones.push({value: user._id.toString(), text:user.name});
                }
            });
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