<template>
  <div id="map"></div>
</template>

<script>
  import {render_map, add_polygon_layer} from '../components/map'

  let map 
  export default {
    name: 'map',
    data() {
      return {}
    },
    async mounted() {
      const map = await render_map('map')
      const case_clusters_feature_collection = await this.$store.dispatch('foci/get_case_clusters_fc')
      const layer_id = add_polygon_layer(map, case_clusters_feature_collection)
    },
    methods: {}
  }
</script>

<style scoped>
  #map {
    height: 800px;
  }
</style>