import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    profiles: [],
    posts: []
  },

  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.token = token;
    },

    removeToken(state) {
      state.token = null;
      localStorage.removeItem("token");
    },

    addProfile(state, profile) {
      state.profiles.push(profile);
    },

    addPost(state, post) {
      state.posts.push(post);
    }
  },

  actions: {
    async register({ commit }, data) {
      const response = await fetch("http://localhost:9000/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        alert("Registration failed");
        return false;
      }
      const responseBody = await response.json();
      commit("setToken", responseBody.token);
      return true;
    },

    async login({ commit }, data) {
      const response = await fetch("http://localhost:9000/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        alert("Login failed");
        return false;
      }
      const responseBody = await response.json();
      commit("setToken", responseBody.token);
      return true;
    },

    getUser({ state }) {
      if (!state.token) {
        return null;
      }
      const base64Payload = state.token.split('.')[1];
      const payload = Buffer.from(base64Payload, 'base64');
      return JSON.parse(payload.toString());
    },

    async createProfile({ commit, state }, data) {
      const response = await fetch(`http://localhost:8000/api/profiles`, {
        method: 'POST',
        headers: { 
          "Authorization": `Bearer ${state.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        return false;
      }
      const profile = await response.json();
      commit("addProfile", profile);
      return true;
    },

    async getProfile({ commit, state }, userId) {
      let profile = state.profiles.filter(profile => profile.userId == userId)[0];
      if (profile) {
        return profile;
      }

      const response = await fetch(`http://localhost:8000/api/profiles/${userId}`, {
        headers: { "Authorization": `Bearer ${state.token}` }
      });
      if (!response.ok) {
        return null;
      }
      profile = await response.json();
      commit("addProfile", profile);
      return profile;
    },

    async createPost({ commit, state }, data) {
      const response = await fetch(`http://localhost:8000/api/posts`, {
        method: 'POST',
        headers: { 
          "Authorization": `Bearer ${state.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        return false;
      }
      const post = await response.json();
      commit("addPost", post);
      return true;
    },

    async getPost({ commit, state }, postId) {
      let post = state.posts.filter(post => post.id == postId)[0];
      if (post) {
        return post;
      }

      const response = await fetch(`http://localhost:8000/api/posts/${postId}`, {
        headers: { "Authorization": `Bearer ${state.token}` }
      });
      if (!response.ok) {
        return null;
      }
      post = await response.json();
      commit("addPost", post);
      return post;
    }
  }
})
