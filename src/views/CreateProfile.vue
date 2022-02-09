<template>
  <div class="container">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group id="input-group-name" label="Your name:" label-for="input-name">
        <b-form-input id="input-name" v-model="form.name" placeholder="Enter name" required></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-birthday" label="Your birthday:" label-for="input-birthday">
        <b-form-datepicker id="input-birthday" v-model="form.birthday" class="mb-2"></b-form-datepicker>
      </b-form-group>

      <b-form-group id="input-group-education" label="Your education:" label-for="input-education">
        <b-form-input id="input-education" v-model="form.education" placeholder="Enter education"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-work" label="Your work:" label-for="input-work">
        <b-form-input id="input-work" v-model="form.work" placeholder="Enter work"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-city" label="Your city:" label-for="input-city">
        <b-form-input id="input-city" v-model="form.city" placeholder="Enter city"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-relationship" label="Relationship status:" label-for="input-relationship">
        <b-form-select id="input-relationship" v-model="form.relationship" :options="relationshipStatuses"></b-form-select>
      </b-form-group>

      <b-button type="submit" variant="primary">Create profile</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'CreateProfile',
  
  data() {
    return {
      form: {
        userId: 0,
        name: "",
        birthday: "",
        education: "",
        work: "",
        city: "",
        relationship: ""
      },
      relationshipStatuses: ["", "single", "taken"],
      show: true
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
      'createProfile'
    ]),

    async onSubmit(event) {
      event.preventDefault();

      const profileCreated = await this.createProfile(this.form);
      if (profileCreated) {
        this.$router.push({ path: `/profile/${this.form.userId}` });
      }
      else {
        alert("Failed to create profile!");
      }
    },

    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.name = "";
      this.form.birthday = "";
      this.form.education = "";
      this.form.work = "";
      this.form.city = "";
      this.form.relationship = "";
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>
