<template>
  <div class="container">
    <CreatePost />
    <div v-if="feed" >
      <Post v-for="post in feed" v-bind:key="post.id" :post="post" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CreatePost from '@/components/CreatePost.vue';
import Post from '@/components/Post.vue'

export default {
  name: 'Home',

  computed: {
    ...mapState([
      'token',
      'feed'
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
      return;
    }
    await this.getFeed();
  },

  methods: {
    ...mapActions([
      'getUser',
      'getProfile',
      'getFeed'
    ])
  },
  
  components: {
    CreatePost,
    Post
  }
}
</script>
