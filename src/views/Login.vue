<template>
  <b-container class="mt-5">
    <b-row class="justify-content-md-center">
        <b-form-group
        id="input-group-1"
        label="Usuario"
        label-for="input-1"
        invalid-feedback="El usuario no es valido"
        :state="validationResult.validName"
        >
            <b-form-input
                id="input-1"
                v-model="form.name"
                type="text"
                required
                placeholder="Ingrese usuario"
            ></b-form-input>
        </b-form-group>
    </b-row>
    <b-row class="justify-content-md-center">
        <b-form-group id="input-group-2" label="Contraseña" label-for="input-2"
             invalid-feedback="La contraseña no es valida"
            :state="validationResult.validPassword">
            <b-form-input
            id="input-2"
            v-model="form.password"
            required
            type="password"
            placeholder="Ingrese contraseña"
            ></b-form-input>
        </b-form-group>
    </b-row>
    <b-row class="justify-content-md-center">
        <b-button type="submit" @click="onSubmit" variant="primary">Sign in</b-button>
    </b-row>
  </b-container>
</template>

<script>
import UserForm from "./models/UserForm";
import UserValidationResult from "./models/UserValidationResult";
import axios from "axios";
  export default {
    data() {
      return {
        form: new UserForm(),
        validationResult: new UserValidationResult()
      }
    },
    methods: {
        async onSubmit() {
            const form = this.form;
            this.validationResult=new UserValidationResult();
            if(this.isNullOrEmpty(form.name)){
                this.validationResult.validName=false;
            } 
            if(this.isNullOrEmpty(form.password)){
                this.validationResult.validPassword=false;
            }
            if(this.validationResult.validName && this.validationResult.validPassword){
                await axios.get("/users", {params:form}).then(respuesta=>{
                    const user =respuesta.data.filter(value=>value.name===form.name)[0];
                    delete user.password;
                    this.$cookies.set("user",user, 60*60);
                    this.validationResult=new UserValidationResult();
                    this.$router.push('/');
                }).catch(error => 
                {   
                    console.log(error.response);
                    const errorCode = error.response.data.code;
                    if(errorCode == 0){
                        this.validationResult.validName=false
                    } else if(errorCode == 1){
                        this.validationResult.validPassword=false
                    }
                });
            }
        },
        isNullOrEmpty(text) {
          return !text || !text.trim();
        },
    }
  }
</script>