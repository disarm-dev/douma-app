<template>
  <div class="list">
    <h1>I am the list view. I render lists.</h1>

    <v-client-table v-if="table_data.length" :data="table_data" :columns="table_columns" @row-click="handle_click"></v-client-table>

    <div>
      <pivot-table :data="table_data">

      </pivot-table>
    </div>
  </div>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex'
  import pivot_table from '../components/pivot_table'

  export default {
    name: 'list',
    components: {'pivot-table': pivot_table},
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
        const case_clusters = this.$store.state.foci.case_clusters

        if (case_clusters && case_clusters.length) {
          return Object.keys(case_clusters[0])
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
</style>