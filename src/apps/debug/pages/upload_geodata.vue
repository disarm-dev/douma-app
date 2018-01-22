<template>
  <div class="applet_container">

    <md-card class="card">
      <md-card-content>
        <div v-if="!spatial_hierarchy_levels_with_data.length" class="md-subheading">No geodata has been loaded.</div>
        <div v-else>
          <p>Currently has geodata for following spatial hierarchies: </p>
          <md-list>
            <md-list-item v-for="level_name in spatial_hierarchy_levels_with_data" :key="level_name" @click="download_spatial_hierarchy(level_name)">
              <md-icon>checkbox</md-icon>
              <span>{{level_name}}</span>
            </md-list-item>
          </md-list>
        </div>
      </md-card-content>
    </md-card>

    <md-card class="card">
      <md-card-content>
      <div class="md-subheading">Please select a spatial hierarchy below to upload geodata for:</div>
        <div>
          <md-radio v-for="level in all_spatial_hierarchy_levels" :key="level.name" v-model="selected_level" :name="level.name" :md-value="level.name">{{level.name}}</md-radio>
        </div>
        <div>
          <md-input-container>
            <label>Upload GeoJSON <span v-if="selected_level">for {{selected_level}}</span></label>
            <md-file :disabled="!selected_level" @selected="upload_buildings"></md-file>
          </md-input-container>
        </div>
      </md-card-content>
    </md-card>

  </div>
</template>

<script>
  import download from 'downloadjs'
  import cache from 'config/cache'
  import {get_all_spatial_hierarchy_levels} from 'lib/instance_data/spatial_hierarchy_helper'

  export default {
    name: 'upload_geodata',
    data () {
      return {
        selected_level: null,
        spatial_hierarchy_levels_with_data: []
      }
    },
    mounted() {
      this.update_spatial_hierarchy_levels_with_data()
    },
    computed: {
      all_spatial_hierarchy_levels() {
        return get_all_spatial_hierarchy_levels()
      }
    },
    methods: {
      upload_buildings(e) {
        if (e.length === 0) return

        const file = e.item(0)
        const file_reader = new FileReader();

        file_reader.onload = (e) => {
          const result = JSON.parse(e.target.result)
          cache.geodata[this.selected_level] = result
          this.$store.commit('root:set_snackbar', {message: `Successfully uploaded geojson for ${this.selected_level}`})
          this.update_spatial_hierarchy_levels_with_data()
        }

        file_reader.readAsText(file)
      },
      update_spatial_hierarchy_levels_with_data() {
        this.spatial_hierarchy_levels_with_data = Object.keys(cache.geodata)
      },
      download_spatial_hierarchy(spatial_hierarchy_level_name) {
        const data_to_download = cache.geodata[spatial_hierarchy_level_name]
        download(JSON.stringify(data_to_download), `${spatial_hierarchy_level_name}.geojson`)
      }
    }
  }
</script>
<style scoped>
  .card {
    margin: 1em 0;
  }
</style>
