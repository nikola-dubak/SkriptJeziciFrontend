<template>
  <div class="container">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group id="input-group-email" label="Email address:" label-for="input-email">
        <b-form-input id="input-email" v-model="form.email" type="email" placeholder="Enter email" required></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-password" label="Password:" label-for="input-password">
        <b-form-input id="input-password" v-model="form.password" type="password" placeholder="Enter password" required></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Login</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <p>
      Don't have an account?
      <b-button type="button" variant="success" to="/register">Register</b-button>
    </p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Login',
  
  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      show: true
    }
  },

  methods: {
    ...mapActions([
      'login'
    ]),

    async onSubmit(event) {
      event.preventDefault();
      if (!this.form.email.includes('@') || !this.form.email.includes('.')) {
        alert("Not a valid email");
      }
      const loggedIn = await this.login(this.form);
      if (loggedIn) {
        this.$router.push({ name: "Home" });
      }
    },

    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.email = "";
      this.form.password = "";
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>
