<template>
  <div class="container">
    <Post v-if="post" :post="post" />
  </div>
</template>

<script>
import Post from '@/components/Post.vue';
import { mapActions } from 'vuex';

export default {
  name: 'PostPage',

  data() {
    return {
      post: null
    }
  },

  methods: {
    ...mapActions([
      'getPost'
    ])
  },

  async mounted() {
    this.post = await this.getPost(this.$route.params.id);
  },

  components: {
    Post
  }
}
</script>