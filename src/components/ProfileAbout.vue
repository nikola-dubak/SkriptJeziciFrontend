<template>
  <b-list-group>
    <b-list-group-item v-if="profile.birthday" variant="dark"><b>Birthday:</b> {{ new Date(profile.birthday).toDateString() }}</b-list-group-item>
    <b-list-group-item v-if="profile.education" variant="dark"><b>Education:</b> {{ profile.education }}</b-list-group-item>
    <b-list-group-item v-if="profile.work" variant="dark"><b>Work:</b> {{ profile.work }}</b-list-group-item>
    <b-list-group-item v-if="profile.city" variant="dark"><b>City:</b> {{ profile.city }}</b-list-group-item>
    <b-list-group-item v-if="profile.relationship" variant="dark"><b>Relationship: </b> {{ profile.relationship }}</b-list-group-item>
  </b-list-group>
</template>

<script>
export default {
  name: 'ProfileAbout',
  
  props: {
    profile: Object
  }
}
</script>