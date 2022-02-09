<template>
  <b-form @submit="onSubmit" v-if="token" id="createPostForm" class="mx-auto">
    <b-form-group id="input-group-text" label="Create new post" label-for="input-name" description="Tell us what's on your mind today!">
      <b-form-textarea id="input-text" v-model="form.text" placeholder="Enter something..." rows="2" no-resize></b-form-textarea>
    </b-form-group>
    <p>
      {{ form.text.length }}
      <b-button type="submit" variant="primary">Create post</b-button>
    </p>
  </b-form>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'CreatePost',

  computed: {
    ...mapState([
      'token'
    ])
  },

  data() {
    return {
      form: {
        userId: null,
        text: ''
      }
    }
  },

  async mounted() {
    const user = await this.getUser();
    if (!user) {
      this.$router.push({ name: "Login" });
      return;
    }
    this.form.userId = user.id;
  },
  
  methods: {
    ...mapActions([
      'getUser',
      'createPost'
    ]),

    async onSubmit(event) {
      event.preventDefault();
      if (this.form.text.length < 3 || this.form.text.length > 255) {
        alert("Post text needs to be between 3 and 255 characters");
      }

      const postCreated = await this.createPost(this.form);
      if (!postCreated) {
        alert("Failed to create post!");
      }
    },
  }
}
</script>

<style scoped>
#createPostForm {
  width: 80%;
  background: #d1ecf1;
  border-radius: 10px;
  padding: 10px;
}

#input-text {
  background: #d1ecf1;
}
</style>