<template>
  <div>
    <filters></filters>
    <div id="map_container"></div>
  </div>
</template>

<script>
  import filters from '../components/filters'
  import {
    render_map, 
    add_polygon_layer, 
    add_points_layer, 
    add_click_handler, 
    remove_click_handler,
    zoom_to_feature
  } from '../components/map'

  let map 
  export default {
    name: 'case_cluster_map',
    components: {filters},
    data() {
      return {
        map_id: 'map_container',

        case_cluster_layer_id: '',
        case_locations_layer_id: ''
      }
    },
    computed: {
      filters() {
        return this.$store.state.foci.filters
      }
    },
    watch: {
      'filters': 'filter_case_clusers'
    },
    async mounted() {
      await this.render_map()
      this.filter_case_clusers()
    },
    methods: {
      async render_map() {
        this.map = await render_map(this.map_id)
        // case clusters
        const case_clusters_feature_collection = await this.$store.dispatch('foci/get_case_clusters_fc')
        if (case_clusters_feature_collection.features.length) {
          this.case_cluster_layer_id = add_polygon_layer(this.map, case_clusters_feature_collection)
          
          add_click_handler(this.map, this.case_cluster_layer_id, this.handle_click)
          
          // Using case clusters as all points should be within one, use case locations if this is no longer true.
          zoom_to_feature(this.map, case_clusters_feature_collection)
        } else {
          this.$root.$emit('notify:toast', 'No case clusters found. Check status page.')
        }
        

        // case locations
        const case_locations_feature_collection = await this.$store.dispatch('foci/get_case_locations_fc')
        if (case_locations_feature_collection.features.length) {
          this.case_locations_layer_id = add_points_layer(this.map, case_locations_feature_collection)
        } else {
          // Having two snack bars right after each other stops the messages from diplaying...
          // this.$root.$emit('notify:toast', 'No case locations found.')
        }
      },
      handle_click(feature) {
        const {_id} = feature.properties
        this.$router.push({name: 'foci:map:detail', params: {foci_id: _id}})
      },
      filter_case_clusers() {
        if (!this.case_cluster_layer_id) return 
        
        const combined_filter = this.filters
          .filter(f => f.value.length)
          .reduce((map_filter, filter) => {
            map_filter.push(['==', filter.name, filter.value])   
            return map_filter    
          }, ['all']) 

        this.map.setFilter(this.case_cluster_layer_id, combined_filter)
      }
    }
  }
</script>

<style scoped>
  #map_container {
    height: 800px;
  }
</style>