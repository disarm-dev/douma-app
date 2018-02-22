<template>
  <div class="container">
    <md-card class="card">
      <md-card-header>
        <div class="md-title">Foci Applet</div>
        <div class="md-subhead">Inspect, filter and update case clusters in real time. Get started by clicking on a link below.</div>
      </md-card-header>

      <md-list>
        <md-list-item>
          <md-icon>autorenew</md-icon> 
          <span>  
            <router-link :to="{name: 'foci:status'}">Status view</router-link>
          </span>
        </md-list-item>

        <md-list-item>
          <md-icon>list</md-icon> 
          <span>
            <router-link :to="{name: 'foci:list'}">List view</router-link>
          </span>
        </md-list-item>

        <md-list-item>
          <md-icon>map</md-icon> 
          <span>
            <router-link :to="{name: 'foci:map'}">Map view</router-link>
          </span>
        </md-list-item>
      </md-list>
    </md-card>
  </div>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex'

  export default {
    name: 'front_page',
    mounted() {
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style scoped>
  .container {
    padding: 0 1em;
  }

  .card {
    max-width: 600px;
    margin: 2em auto;
  }
</style>