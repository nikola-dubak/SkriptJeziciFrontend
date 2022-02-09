<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">SocialNetwork</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-text id="text-welcome" v-if="profile">Welcome, {{ profile.name }}!</b-nav-text>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item v-if="token" :to="`/profiles/${userId}`">My profile</b-nav-item>
          <b-nav-item v-if="token" to="/groups">Groups</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>
          <b-nav-item v-if="!token" to="/register">Register</b-nav-item>
          <b-nav-item v-if="!token" to="/login">Log In</b-nav-item>
          <b-nav-item v-else @click="logout">Log Out</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      userId: null,
      searchQuery: '',
      profile: null
    }
  },

  computed: {
    ...mapState([
      'token',
      'profiles'
    ]),

    role() {
      if (!token) {
        return null;
      }
      const user = this.getUser();
      return user.role;
    }
  },

  watch: {
    async token(newValue, oldValue) {
      if (newValue) {
        const user = await this.getUser();
        this.userId = user.id;
        this.profile = await this.getProfile(this.userId);
      }
      else {
        this.userId = null;
        this.profile = null;
        this.$router.push({ name: "Login" });
      }
    },

    profiles: {
      async handler(newValue, oldValue) {
        this.profile = await this.getProfile(this.userId);
      },
      deep: true
    }
  },

  created() {
    if (localStorage.token) {
      this.setToken(localStorage.token);
    }
  },

  methods: {
    ...mapActions([
      'getUser',
      'getProfile'
    ]),

    ...mapMutations([
      'setToken',
      'removeToken'
    ]),

    logout() {
      this.removeToken();
    },

    search(e) {
      e.preventDefault();

      const sq = this.searchQuery;
      this.searchQuery = '';
      
      this.$router.push({ name: 'Search', query: { q: sq } });
    }
  }
}
</script>

<style>
body {
  background-color: #f1f1f1 !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.container {
  margin-top: 2em;
}
#text-welcome {
  color: rgba(255, 255, 255, 0.75);
  font-weight: bold;
}
</style>