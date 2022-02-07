<template>
  <div class="container">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group id="input-group-email" label="Email address:" label-for="input-email" description="We'll never share your email with anyone else.">
        <b-form-input id="input-email" v-model="form.email" type="email" placeholder="Enter email" required></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-password" label="Password:" label-for="input-password" description="We'll never share your password with anyone else.">
        <b-form-input id="input-password" v-model="form.password" type="password" placeholder="Enter password" required></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-password-confirm" label="Confirm password:" label-for="input-password-confirm" description="Confirm your password">
        <b-form-input id="input-password-confirm" v-model="confirmPassword" type="password" placeholder="Confirm password" required></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Register</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Register',
  
  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      confirmPassword: "",
      show: true
    }
  },

  methods: {
    ...mapActions([
      'register'
    ]),

    async onSubmit(event) {
      event.preventDefault();
      if (!this.form.email.includes('@') || !this.form.email.includes('.')) {
        alert("Not a valid email");
      }
      if (this.form.password != this.confirmPassword) {
        alert("Password confirmation is not matching");
        return;
      }
      const registered = await this.register(this.form);
      if (registered) {
        this.$router.push({ name: "Home" });
      }
    },

    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.email = "";
      this.form.password = "";
      this.confirmPassword = "";
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>
