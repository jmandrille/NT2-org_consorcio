import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/home/Home.vue";
import Perfil from "../views/Perfil.vue";
import Tareas from "../views/Tareas.vue";
import Reporte from "../views/reporte/Reporte.vue";
import Historico from "../views/historico/Historico.vue";
import Login from "../views/Login.vue";
import Usuario from "../views/Usuario.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/perfil",
    name: "Perfil",
    component: Perfil
  },
  {
    path: "/reporte",
    name: "Reporte",
    component: Reporte
  },
  {
    path: "/historico",
    name: "Historico",
    component: Historico
  },
  {
    path: "/tareas",
    name: "Tareas",
    component: Tareas
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/usuario",
    name: "Usuario",
    component: Usuario
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
