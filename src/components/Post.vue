<template>
  <b-card v-if="profile" no-body class="card-profile-small">
    <b-card-header :class="group ? 'bg-secondary' : 'bg-info' ">
      <b-link class="profile-link" :to="`/profiles/${profile.userId}`">{{ `${profile.name} #${profile.userId}` }}</b-link>
      <b class="group-link" v-if="group"> in </b>
      <b-link v-if="group" class="group-link" :to="`/groups/${group.id}`">{{ `${group.name} #${group.id}` }}</b-link>
    </b-card-header>
    <b-card-body>
      <b-card-text>{{ post.text }}</b-card-text>
      <b-button-group v-if="likedPostIds">
        <b-button v-if="!likedPostIds.some(likedPostId => likedPostId == post.id)" variant="primary" @click="like(post.id)">Like</b-button>
        <b-button v-else variant="danger" @click="unlike(post.id)">Unlike</b-button>
      </b-button-group>
    </b-card-body>
    <b-card-footer class="post-footer bg-light">
      {{ `Posted at ${ new Date(post.createdAt).toLocaleString("sr-RS") }` }}
    </b-card-footer>
  </b-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Post',

  data() {
    return {
      user: null,
      profile: null,
      group: null
    }
  },

  computed: {
    ...mapState([
      'likedPostIds'
    ])
  },

  methods: {
    ...mapActions([
      'getUser',
      'getProfile',
      'getGroup',
      'getLikedPostIds',
      'like',
      'unlike'
    ])
  },

  async mounted() {
    this.user = await this.getUser();
    this.profile = await this.getProfile(this.post.userId);
    await this.getLikedPostIds();
    if (this.post.groupId) {
      this.group = await this.getGroup(this.post.groupId);
    }
  },

  props: {
    post: Object
  }
}
</script>

<style>
.card-profile-small {
  margin-top: 1em;
}
.profile-link, .group-link {
  font-size: 1.2em;
  color: #f8f9fa;
}
.post-footer {
  font-size: 0.8em;
}
</style>