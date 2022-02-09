<template>
  <b-card v-if="profile" no-body class="card-profile-small">
    <b-card-header class="bg-info">
      <b-link class="profile-link" :to="`/profiles/${profile.userId}`">{{ `${profile.name} #${profile.userId}` }}</b-link>
    </b-card-header>
    <b-card-body>
      <b-card-text>{{ post.text }}</b-card-text>
    </b-card-body>
    <b-card-footer class="post-footer bg-light">
      {{ `Posted at ${ new Date(post.createdAt).toLocaleString("sr-RS") }` }}
    </b-card-footer>
  </b-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Post',

  data() {
    return {
      user: null,
      profile: null
    }
  },

  methods: {
    ...mapActions([
      'getUser',
      'getProfile'
    ])
  },

  async mounted() {
    this.user = await this.getUser();
    this.profile = await this.getProfile(this.post.userId);
  },

  props: {
    post: Object
  }
}
</script>

<style scoped>
.card-profile-small {
  margin-top: 1em;
}
.profile-link {
  font-size: 1.2em;
  color: #f8f9fa;
}
.post-footer {
  font-size: 0.8em;
}
</style>