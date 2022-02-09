<template>
  <div class="container">
    <CreatePost />
    <div v-if="posts" >
      <Post v-for="post in posts" v-bind:key="post.id" :post="post" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CreatePost from '@/components/CreatePost.vue';
import Post from '@/components/Post.vue'

export default {
  name: 'Home',

  data() {
    return {
      posts: null
    }
  },

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
      return;
    }
    this.posts = await this.getFeed();
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
