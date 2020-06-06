import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Perfil from "../views/Perfil.vue";
import Tareas from "../views/Tareas.vue";
import Reporte from "../views/Reporte.vue";

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
    path: "/tareas",
    name: "Tareas",
    component: Tareas
  }
];

const router = new VueRouter({
  routes
});

export default router;
