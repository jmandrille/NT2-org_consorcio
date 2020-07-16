import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/home/Home.vue";
import Reporte from "../views/reporte/Reporte.vue";
import Historico from "../views/historico/Historico.vue";
import Login from "../views/sesion/Login.vue";
import Usuario from "../views/sesion/Usuario.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
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
