<template>
  <div>
    <filters></filters>
    <div id="map"></div>
  </div>
</template>

<script>
  import filters from '../components/filters'
  import {render_map, add_polygon_layer} from '../components/map'

  let map 
  export default {
    name: 'map',
    components: {filters},
    data() {
      return {
        map_id: 'map'
      }
    },
    mounted() {
      this.render_map()
    },
    methods: {
      async render_map() {
        const map = await render_map(this.map_id)
        const case_clusters_feature_collection = await this.$store.dispatch('foci/get_case_clusters_fc')
        const layer_id = add_polygon_layer(map, case_clusters_feature_collection)
      },
      handle_click(row) {
        this.$router.push({name: 'foci:map:detail', params: {foci_id: row._id}})
      }
    }
  }
</script>

<style scoped>
  #map {
    height: 800px;
  }
</style>