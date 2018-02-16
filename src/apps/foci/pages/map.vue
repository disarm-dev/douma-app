<template>
  <div>
    <filters></filters>
    <div id="map"></div>
  </div>
</template>

<script>
  import filters from '../components/filters'
  import {render_map, add_polygon_layer, add_points_layer} from '../components/map'

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
        // case clusters
        const case_clusters_feature_collection = await this.$store.dispatch('foci/get_case_clusters_fc')
        const case_cluster_layer_id = add_polygon_layer(map, case_clusters_feature_collection)

        // case locations
        const case_locations_feature_collection = await this.$store.dispatch('foci/get_case_locations_fc')
        const case_locations_layer_id = add_points_layer(map, case_locations_feature_collection)
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