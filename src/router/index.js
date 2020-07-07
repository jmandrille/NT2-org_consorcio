import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Perfil from "../views/Perfil.vue";
import Tareas from "../views/Tareas.vue";
import Reporte from "../views/Reporte.vue";
import Historico from "../views/Historico.vue";
import Login from "../views/Login.vue";

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
  }
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
