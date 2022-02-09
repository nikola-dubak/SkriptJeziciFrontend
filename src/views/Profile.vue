<template>
  <div class="container" v-if="profile">
    <b-card no-body class="card-profile-small bg-dark">
      <b-card-header class="bg-dark">
        <b-link class="profile-link" :to="`/profiles/${profile.userId}`">{{ `${profile.name} #${profile.userId}` }} </b-link>
        <b-button-group v-if="profile.userId != user.id && follows">
          <b-button v-if="!follows.some(follow => follow.followedId == profile.userId)" variant="primary" @click="follow(profile.userId)">Follow</b-button>
          <b-button v-else variant="danger" @click="unfollow(profile.userId)">Unfollow</b-button>
        </b-button-group>
      </b-card-header>
      <b-card-body>
        <ProfileAbout :profile="profile" />
        
      </b-card-body>
      <b-card-footer class="profile-footer bg-dark text-light">
        {{ `Joined at ${ new Date(profile.createdAt).toLocaleString("sr-RS") }` }}
      </b-card-footer>
    </b-card>
    <div v-if="feed">
      <Post v-for="post in feed.filter(post => post.userId == profile.userId)" v-bind:key="post.id" :post="post" />
    </div>
  </div>
</template>

<script>
import ProfileAbout from '@/components/ProfileAbout.vue';
import Post from '@/components/Post.vue';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Profile',

  data() {
    return {
      user: null,
      profile: null,
      posts: null
    }
  },

  computed: {
    ...mapState([
      'feed',
      'follows'
    ])
  },

  methods: {
    ...mapActions([
      'getUser',
      'getProfile',
      'getFollows',
      'getFeed',
      'follow',
      'unfollow'
    ])
  },

  async mounted() {
    this.user = await this.getUser();
    this.profile = await this.getProfile(this.$route.params.id);
    await this.getFollows();
    await this.getFeed();
  },

  components: {
    ProfileAbout,
    Post
  }
}
</script>