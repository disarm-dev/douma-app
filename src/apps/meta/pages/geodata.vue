<template>
  <div>
    <md-list>
      <md-list-item v-for="level in level_names" :key="level">
        <span>{{level}}</span>
        <md-button @click="download(level)">Download</md-button>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
  import moment from 'moment'
  import download from 'downloadjs'
  import {get} from 'lodash'

  import cache from 'config/cache'

  export default {
    name: 'geodata',
    data() {
      return {
        level_names: []
      }
    },
    computed: {
      instance_config() {return this.$store.state.instance_config}
    },
    created() {
      this.level_names = this.instance_config.spatial_hierarchy.levels.map(l => l.name)
    },
    methods: {
      download(level_name) {
        const level_geodata = get(cache.geodata, level_name, [])
        const slug = this.instance_config.instance.slug

        if (level_geodata.length === 0) {
          console.log(`No geodata for ${level_name}`)
          return false
        }

        const date = moment().format('YYYY-MM-DD_HHmm')
        download(JSON.stringify(level_geodata), `${slug}.${level_name}.${date}.geojson`)
      }
    }
  }
</script>

<style scoped>

</style>