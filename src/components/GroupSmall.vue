<template>
  <b-card v-if="joinedGroupIds" bg-variant="dark" text-variant="white" :title="`${group.name} #${group.id}`" :sub-title="group.description" >
    <b-button v-if="!joinedGroupIds.some(groupId => groupId == group.id)" variant="primary" @click="join">Join group</b-button>
    <b-button v-else variant="danger" @click="leave">Leave group</b-button>
  </b-card>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'GroupSmall',

  async mounted() {
    await this.getJoinedGroupIds();
  },

  computed: {
    ...mapState([
      'joinedGroupIds'
    ])
  },

  methods: {
    ...mapActions([
      'getJoinedGroupIds',
      'joinGroup',
      'leaveGroup'
    ]),

    async join() {
      await this.joinGroup(this.group.id);
    },

    async leave() {
      await this.leaveGroup(this.group.id);
    }
  },

  props: {
    group: Object
  }
}
</script>

<style scoped>

</style>