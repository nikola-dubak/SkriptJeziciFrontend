<template>
  <div class="container">
    <div v-if="group && feed" >
      <GroupSmall :group="group" />
      <Post v-for="post in feed.filter(post => post.groupId == group.id)" v-bind:key="post.id" :post="post" />
    </div>
    <h2 v-else>Group not found!</h2>
  </div>
</template>

<script>
import GroupSmall from '@/components/GroupSmall.vue';
import Post from '@/components/Post.vue';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Group',

  data() {
    return {
      group: null
    }
  },

  computed: {
    ...mapState([
      'feed'
    ])
  },

  methods: {
    ...mapActions([
      'getGroup',
      'getFeed'
    ])
  },

  async mounted() {
    this.group = await this.getGroup(this.$route.params.id);
    await this.getFeed();
  },

  components: {
    GroupSmall,
    Post
  }
}
</script>

<style scoped>

</style>