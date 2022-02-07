<template>
  <div class="home">
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Home',

  computed: {
    ...mapState([
      'token'
    ])
  },

  async mounted() {
    if (!this.token) {
      this.$router.push({ name: "Login" });
      return;
    }
    const user = await this.getUser();
    const profile = await this.getProfile(user.id);
    if (!profile) {
      this.$router.push({ name: "CreateProfile" });
    }
  },

  methods: {
    ...mapActions([
      'getUser',
      'getProfile'
    ])
  }
}
</script>
