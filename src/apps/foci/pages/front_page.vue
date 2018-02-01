<template>
  <div>
    <h1>Front page</h1>

    <ul>
      <li>
        <router-link to="foci:list">List view</router-link>
      </li>
      <li>
        <router-link to="foci:map">Map view</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'foci:detail', params: { foci_id: '123'}}">Test Detail view</router-link>
      </li>

    </ul>
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

</style>