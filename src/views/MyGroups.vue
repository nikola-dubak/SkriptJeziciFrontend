<template>
  <div class="container">
    <GroupSmall v-for="joinedGroup in joinedGroups" v-bind:key="joinedGroup.id" :group="joinedGroup" />
  </div>
</template>

<script>
import GroupSmall from '@/components/GroupSmall.vue';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'MyGroups',

  data() {
    return {
      joinedGroups: []
    }
  },

  computed: {
    ...mapState([
      'joinedGroupIds'
    ])
  },

  watch: {
    joinedGroupIds: {
      async handler(newValue, oldValue) {
        this.joinedGroups = await this.getJoinedGroups();
      },
      deep: true
    }
  },

  async mounted() {
    await this.getJoinedGroupIds();
    this.joinedGroups = await this.getJoinedGroups();
  },

  methods: {
    ...mapActions([
      'getJoinedGroupIds',
      'getGroup'
    ]),

    async getJoinedGroups() {
      let groups = [];
      for (let i = 0; i < this.joinedGroupIds.length; i++) {
        const group = await this.getGroup(this.joinedGroupIds[i]);
        if (group) {
          groups.push(group);
        }
      }
      return groups;
    }
  },

  components: {
    GroupSmall
  }
}
</script>