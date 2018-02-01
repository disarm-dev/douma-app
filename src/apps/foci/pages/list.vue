<template>
  <div class="list">
    <h1>I am the list view. I render lists.</h1>

    <v-client-table v-if="table_data.length" :data="table_data" :columns="table_columns"></v-client-table>
  </div>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex'

  export default {
    name: 'list',
    mounted() {
    },
    data() {
      return {}
    },
    computed: {
      table_data() {
        const case_clusters = this.$store.state.foci.case_clusters
        return case_clusters.features.map(f => f.properties)
      },
      table_columns() {
        const case_clusters = this.$store.state.foci.case_clusters
        const properties = case_clusters.features.map(f => f.properties)
        return Object.keys(properties[0])
      }
    },
    methods: {}
  }
</script>

<style scoped>
  .list {
    max-width: 900px;
    margin: 0 auto;
  }
</style>