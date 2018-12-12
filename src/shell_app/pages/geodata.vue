<template>
  <div class="applet_container">
    <h2>Geographic data</h2>
    <p>To continue, you need to download {{levels.length}} files of geographic data. They will be stored on your device (if possible), so you should only have to download one time.</p>
    <p>If you have a slow connection, try downloading one at a time. Otherwise you can start multiple downloads going at the same time.</p>
    <p>Downloading will stop if it's taking too long. You can resume downloading if this happens by clicking 'download' again.</p>
    <div class="list">

      <md-list>
        <md-list-item v-for="level in levels" :key="level._id" >


          <!-- DOWNLOAD STATUS-->
          <md-avatar>
            <md-icon v-if="loading_progress[level.name].status === 'complete'" class="success">check_circle</md-icon>
            <md-icon v-else-if="loading_progress[level.name].status === 'update_available'" class="md-warn">update</md-icon>
            <span v-else-if="$loading.isLoading(`geodata/${level.name}`)"><md-spinner md-indeterminate class="md-accent" :md-size="30"></md-spinner></span>
            <md-icon v-else class="md-warn">error</md-icon>
          </md-avatar>


          <!-- LEVEL NAME -->
          <span>
            <md-chip v-if="loading_progress[level.name].status === 'update_available'" class="md-warn"> update available</md-chip>
            {{level.name}}
          </span>


          <!--Retrieve BUTTON -->
          <md-button
            @click.native="retrieve_geodata_for(level)"
            :disabled="$loading.isLoading(`geodata/${level.name}`)"
            class="md-dense list-button md-raised md-primary"
          >
            Retrieve
          </md-button>

          <md-button
            @click="download(level)"
          >
            Download
          </md-button>



        </md-list-item>
      </md-list>

      <div>
        <md-button class='md-primary md-raised' @click.native="back">Back</md-button>
      </div>

    </div>
  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex'
  import {get} from 'lodash'
  import download from 'downloadjs'
  import moment from 'moment'

  import {get_all_spatial_hierarchy_level_names, configure_spatial_helpers} from 'lib/instance_data/spatial_hierarchy_helper'
  import {geodata_has_level, geodata_versions_correct, geodata_level_version_matches_instance_config } from 'lib/models/geodata/geodata.valid'
  import {get_geodata_for} from 'lib/models/geodata/remote'
  import {hydrate_geodata_cache_from_idb} from "lib/models/geodata/local.geodata_store";
  import cache from 'config/cache'

  import {get_and_save_layer} from '../models/geodata/controller'

  export default {
    name: 'geodata',
    data () {
      return {
        loading_progress: {},
        levels: []
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        instance_id: state => state.instance_config.instance_id,
        instance_slug: state => state.instance_config.instance.slug,
      })
    },
    created() {
      const levels = this.instance_config.spatial_hierarchy.levels
      this.levels = levels

      for (let level of this.levels) {
        this.$set(this.loading_progress, level.name,  {
          status: '',
          progress: '',
          total: ''
        })
      }
    },
    async mounted() {
      configure_spatial_helpers(this.instance_config)
      await hydrate_geodata_cache_from_idb(this.instance_slug)
      this.calculate_loading_progress()
    },
    methods: {
      calculate_loading_progress() {
        this.levels.forEach(level => {
          let status

          if (geodata_has_level(level.name)) {
            if (!geodata_level_version_matches_instance_config(level.name)) {
              status = 'update_available'
            } else {
              status = 'complete'
            }
          } else {
            status = 'none'
          }

          this.loading_progress[level.name].status = status
        })
      },
      async retrieve_geodata_for(level) {
        this.$loading.startLoading(`geodata/${level.name}`)

        try {
          await get_and_save_layer({
            level_id: level.level_id,
            instance_slug: this.instance_slug, 
            instance_id: this.instance_id,
            geodata_version: this.instance_config.spatial_hierarchy.data_version
          })

          await hydrate_geodata_cache_from_idb(this.instance_slug)
          this.calculate_loading_progress()
        } catch (err) {
          console.error(err)
        }

        this.$loading.endLoading(`geodata/${level.name}`)
      },
      back() {
        this.$router.push('/')
      },
      download(level_name) {
        console.log('download', level_name)
        const level_geodata = get(cache.geodata, level_name, [])

        if (level_geodata.length === 0) {
          console.log("No geodata")
          return false
        }

        const date = moment().format('YYYY-MM-DD_HHmm')

        download(JSON.stringify(level_geodata), `${this.instance_slug}.${level_name}.${date}.geojson`)
      }
    }
  }
</script>

<style lang="css" scoped>
  .applet_container {
    max-width: 800px;
    margin: 0 auto;
  }

  .list {
    max-width: 600px;
    margin: 0 auto;
  }

  .list-button {
    float: right;
  }

  .success {
    color: #689F38;
  }
</style>
