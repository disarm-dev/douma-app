<template>
  <div>
    <controls>
      <md-button slot="primary_action" :disabled="!$can('write', 'irs_record_point')" class="md-icon-button md-raised md-primary" @click.native='$router.push("/irs/record_point/new")'>
        <md-icon>add</md-icon>
      </md-button>

      <template slot="menu_items">
        <md-menu-item :disabled="!$can('write', 'irs_record_point') || syncing || unsynced_count === 0 || !online" @click="sync">
          <md-icon>sync</md-icon>
          <span>Sync {{unsynced_count}} responses</span>
        </md-menu-item>

        <md-menu-item :disabled="!$can('write', 'irs_record_point') || syncing || unsynced_count === 0" @click="download_records">
          <md-icon>file_download</md-icon>
          <span>Export {{unsynced_count}} unsynced</span>
        </md-menu-item>

      </template>

      <div v-if="!online" slot="text">
        Offline - unable to sync
      </div>

    </controls>

    <div class='applet_container'>
       <!--<local_record_summary></local_record_summary>-->

      <!-- LIST ALL -->
      <md-card>
        <md-card-header>
          <div class="md-title">{{responses.length}} responses ({{unsynced_count}} unsynced)</div>
        </md-card-header>
        <md-card-content>
          <md-input-container>
            <label>filter by ID</label>
            <md-input v-model="id_search_string"></md-input>
          </md-input-container>

          <md-list>
            <virtual_list :size="40" :remain="10">
              <md-list-item
                v-for='response in filtered_responses'
                :index='response'
                :class="{'md-primary': !response.synced || !response.uneditable}"
                :key="response.id"
              >
                <md-icon>
                  {{response.synced ? 'check' : (response.uneditable ? 'warning' : 'mode_edit')}}
                </md-icon>

                <div>
                  <router-link
                    :to="{name: response.synced || response.uneditable ? 'irs_record_point:view' : 'irs_record_point:edit', params: {response_id: response.id}}">
                    {{format_response(response)}}
                  </router-link>
                </div>
              </md-list-item>
            </virtual_list>
          </md-list>
        </md-card-content>
      </md-card>

    </div>
  </div>
</template>

<script>
  import virtual_list from 'vue-virtual-scroll-list'
  import download from 'downloadjs'
  import moment from 'moment-mini'
  import {mapState} from 'vuex'
  import {cloneDeep, flatten, get} from 'lodash'

  import controls from 'components/controls.vue'
  import local_record_summary from './local_record_summary'

  export default {
    name: 'List',
    components: {controls, virtual_list, local_record_summary},
    data () {
      return {
        syncing: false,
        target_denominator: 0,
        id_search_string: ''
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        unsynced_count: state => state.irs_record_point.responses.filter(r => !r.synced).length,
        online: state => state.network_online
      }),
      responses() {
        return this.$store.state.irs_record_point.responses
      },
      filtered_responses() {
        return this.responses
          .filter(r => {
            if (!this.id_search_string) return true
            return this.short_id(r.id).includes(this.id_search_string)
          })
          .sort((a, b) => new Date(b.recorded_on) - new Date(a.recorded_on))
      },
      unsynced_responses() {
        return this.responses.filter(r => !r.synced)
      }
    },
    mounted () {
      this.$store.dispatch('irs_record_point/read_records')
    },
    methods: {
      format_response(response) {
        const id = this.short_id(get(response, 'id', 'no id'))
        const location_name = get(response, 'location.selection.name', '')
        const ago = this.format_datetime_from_now(response.recorded_on)

        return `${ago} in ${location_name} (id: ${id})`
      },
      format_datetime_from_now(date) {
        return moment(date).fromNow()//format('hh:mm a DD MMM YYYY')
      },
      format_datetime(date) {
        return moment(date).format('hh:mm a DD MMM YYYY')
      },
      sync() {
        this.$startLoading('irs_record_point/sync')
        this.syncing = true

        this.$store.dispatch('irs_record_point/create_records', this.unsynced_responses)
          .then((results) => {
            const last_successful_sync_count = flatten(results.pass).length
            const last_failed_sync_count = flatten(results.fail).length

            this.$endLoading('irs_record_point/sync')
            this.syncing = false

            // did any responses sync?
            if (last_successful_sync_count > 0) {
              this.$store.commit('root:set_snackbar', {message: `Successfully synced ${last_successful_sync_count} responses`})
            } else if (last_successful_sync_count === 0 && last_failed_sync_count > 0) {
              this.$store.commit('root:set_snackbar', {message: `All ${last_failed_sync_count} responses failed to sync`})
            } else {
              this.$store.commit('root:set_snackbar', {message: `${last_successful_sync_count} responses synced, ${last_failed_sync_count} responses failed to sync`})
            }

          })
          .catch((e) => {
            console.log(e)
            if (e.response && e.response.status !== 401) {
              this.$store.commit('root:set_snackbar', {message: `Problem syncing responses`})
            }
            this.$endLoading('irs_record_point/sync')
            this.syncing = false
          })
      },
      download_records() {
        const content = JSON.stringify(this.unsynced_responses)
        const date = moment().format('YYYY-MM-DD_HHmm')
        download(content, `${this.instance_config.instance.slug}_responses_export_${date}.json`)
      },
      short_id(id) {
        return id.substring(0,5)
      }
    }
  }

</script>
