<template>
  <div id="app" class="container col-12">
    <div class="row">
      <nav
        id="header"
        class="navbar navbar-expand-lg navbar-dark bg-dark col-12"
      >
        <div class="container col-12">
          <a class="navbar-brand" href="#">
            <img
              width="45px"
              height="45px"
              src="./assets/logo2.png"
              alt="tc4"
            />
            TheConsortium4
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbar"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbar">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item" v-if="show">
                <router-link class="nav-link" to="/">Home</router-link>
              </li>
              <li class="nav-item" v-if="show">
                <router-link class="nav-link" to="/reporte"
                  >Reporte</router-link
                >
              </li>
              <li class="nav-item" v-if="show">
                <router-link class="nav-link" to="/historico"
                  >Historico</router-link
                >
              </li>
            </ul>
          </div>
          <div class="collapse navbar-collapse" id="navbar">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item" v-if="!show">
                <router-link class="nav-link" to="/login">Login</router-link>
              </li>
              <li class="nav-item" v-if="show">
                <router-link class="nav-link" to="/usuario">{{username}}</router-link>
              </li>
              <!-- <li class="nav-item">
                <router-link class="nav-link" to="/encargado">Encargado</router-link>
              </li> -->
            </ul>
          </div>
        </div>
      </nav>
    </div>
    <div class="col-12">
      <div class="row">
        <b-alert
        :show="dismissCountDown"
        dismissible
        variant="warning"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="countDownChanged"
        >
        <p>Su sesión expiró, será redirigido al login en {{ dismissCountDown }} segundos...</p>
        <b-progress
          variant="warning"
          :max="dismissSecs"
          :value="dismissCountDown"
          height="4px"
        ></b-progress>
        </b-alert>
      </div>
      <router-view />
    </div>
    <div class="row">
      <footer id="footer" class="pb-4 pt-4">
        <div class="container fixed-bottom">
          <div class="text-center align-items-center">
            <h6>© TheConsortium4 - 2020</h6>
            <small>- Todos los derechos reservados -</small>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      show:this.$cookies.get("user") != null,
      dismissSecs: 3,
      dismissCountDown: 0,
      showLoginAlert: false,
      username: this.$cookies.get("user") ? this.$cookies.get("user").name : null,
    };
  },
  watch:{
    $route(){
      this.show=this.$cookies.get("user") != null
      if(this.$cookies.get("user") == null) {
        this.showAlert();
        setTimeout(function(){
          this.location.href = '/login';
        }, this.dismissSecs*1000);
      }else{
        this.username = this.$cookies.get("user").name;
      }
    }
  },
  methods: {
    toggleColors: function(active, path) {
      return (active = this.$router.currentRoute.path == "/" + path);
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.navbar-fixed-left {
  width: 140px;
  position: fixed;
  border-radius: 0;
  height: 100%;
}
</style>
