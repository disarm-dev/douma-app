<template>
  <div class="applet_container">
    <h2>Geographic data</h2>
    <p>To continue, you need to download {{level_names.length}} files of geographic data. They will be stored on your device (if possible), so you should only have to download one time.</p>
    <p>If you have a slow connection, try downloading one at a time. Otherwise you can start multiple downloads going at the same time.</p>
    <p>Downloading will stop if it's taking too long. You can resume downloading if this happens by clicking 'download' again.</p>
    <div class="list">

      <md-list>
        <md-list-item v-for="level in level_names" :key="level" >


          <!-- DOWNLOAD STATUS-->
          <md-avatar>
            <md-icon v-if="loading_progress[level].status === 'complete'" class="success">check_circle</md-icon>
            <md-icon v-else-if="loading_progress[level].status === 'update_available'" class="md-warn">update</md-icon>
            <span v-else-if="$loading.isLoading(`geodata/${level}`)"><md-spinner md-indeterminate class="md-accent" :md-size="30"></md-spinner></span>
            <md-icon v-else class="md-warn">error</md-icon>
          </md-avatar>


          <!-- LEVEL NAME -->
          <span>
            <md-chip v-if="loading_progress[level].status === 'update_available'" class="md-warn"> update available</md-chip>
            {{level}}
          </span>


          <!--DOWNLOAD BUTTON -->
          <md-button
                  @click.native="retrieve_geodata_for(level)"
                  :disabled="!online || $loading.isLoading(`geodata/${level}`)"
                  class="md-dense list-button md-raised md-primary"
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

  import {get_all_spatial_hierarchy_level_names} from 'lib/instance_data/spatial_hierarchy_helper'
  import {geodata_has_level, geodata_versions_correct, geodata_level_version_matches_instance_config } from 'lib/models/geodata/geodata.valid'
  import {get_geodata_for} from 'lib/models/geodata/remote'
  import {get_and_store_locally_geodata_for} from 'lib/models/geodata/remote'
  import {hydrate_geodata_cache_from_idb} from "lib/models/geodata/local.geodata_store";

  export default {
    name: 'geodata',
    data () {
      return {
        loading_progress: {},
        level_names: get_all_spatial_hierarchy_level_names()
      }
    },
    computed: {
      ...mapState({
        online: 'network_online',
        instance_slug: state => state.instance_config.instance.slug,
      }),
      ...mapGetters({
        isLoading: 'loading/isLoading'
      })
    },
    created() {
      for (let level_name of this.level_names) {
        this.$set(this.loading_progress, level_name,  {
          status: '',
          progress: '',
          total: ''
        })
      }
    },
    mounted() {
      hydrate_geodata_cache_from_idb(this.instance_slug).then(() => {
        this.calculate_loading_progress()
      })
    },
    methods: {
      calculate_loading_progress() {
        this.level_names.forEach(level => {
          let status

          if (geodata_has_level(level)) {
            if (!geodata_level_version_matches_instance_config(level)) {
              status = 'update_available'
            } else {
              status = 'complete'
            }
          } else {
            status = 'none'
          }

          this.loading_progress[level].status = status
        })
      },
      retrieve_geodata_for(level) {
        this.$loading.startLoading(`geodata/${level}`)

        get_and_store_locally_geodata_for(level, this.instance_slug)
          .then(() => {
            return hydrate_geodata_cache_from_idb(this.instance_slug)
          })
          .then(() => {
            this.calculate_loading_progress()
            this.$loading.endLoading(`geodata/${level}`)
          })
          .catch((err) => {
            this.$loading.endLoading(`geodata/${level}`)
            console.error(err)
          })

      },
      back() {
        this.$router.push('/')
      }
    }
  }
</script>

<style lang="css" scoped>
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
