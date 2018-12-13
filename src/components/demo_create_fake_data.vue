<template>
  <md-card>
    <md-card-content>
      <p>This is a demo. You can click below to quickly create and sync some fake data.
        You can add more records using the
        <router-link to="/irs/record_point/list">data collector </router-link>
        , or add more fake data on the
        <router-link to="/debug/fake_data">debug page</router-link>
      </p>

      <md-button @click="create_and_sync_fake_data" class="md-accent">Create fake data</md-button>
    </md-card-content>
  </md-card>
</template>

<script>

  import {create_and_sync_fake_data} from 'config/demo_config'

  export default {
    methods: {
      create_and_sync_fake_data() {
        create_and_sync_fake_data()
      }
    }
  }
</script>

<style scoped>

</style>