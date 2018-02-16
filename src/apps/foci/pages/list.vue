<template>
  <div class="list">

    <div class="table-container">
      <md-table-card>
        <md-toolbar>
          <h1 class="md-title">Case clusters</h1>
        </md-toolbar>
        <pretty-table v-if="table_data.length" :table_data="table_data" :table_columns="table_columns" @click="handle_click"></pretty-table>
      </md-table-card>
    </div>

    <div class="table-container">
      <md-table-card>
        <md-toolbar>
          <h1 class="md-title">Summary</h1>
        </md-toolbar>
        <pivot-table :data="table_data"></pivot-table>
      </md-table-card>
    </div>

  </div>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex'
  import pivot_table from '../components/pivot_table'
  import pretty_table from '../components/table'

  export default {
    name: 'list',
    components: {'pivot-table': pivot_table, 'pretty-table': pretty_table},
    computed: {
      table_data() {
        const case_clusters = this.$store.state.foci.case_clusters
        if (case_clusters && case_clusters.length) {
          return case_clusters
        } else {
          return []
        }
      },
      table_columns() {
        const ignored_columns = ['geometry', 'personalised_instance_id']
        const case_clusters = this.$store.state.foci.case_clusters

        if (case_clusters && case_clusters.length) {
          const columns = Object.keys(case_clusters[0])
          return columns.filter(column => !ignored_columns.includes(column))
        } else {
          return []
        }
      }
    },
    methods: {
      handle_click({row, event}) {
        this.$router.push({name: 'foci:detail', params: {foci_id: row._id}})
      }
    }
  }
</script>

<style scoped>
  .list {
    max-width: 900px;
    margin: 0 auto;
  }
  
  .table-container {
    margin: 3em 0;
  }
</style>