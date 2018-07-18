<template>
  <div>
    <controls>
      <md-button slot="primary_action" :disabled="!$can('write', 'irs_record_point')"
                 class="md-icon-button md-raised md-primary" @click.native='$router.push("/irs/record_point/new")'>
        <md-icon>add</md-icon>
      </md-button>

      <template slot="menu_items">
        <md-menu-item :disabled="!$can('write', 'irs_record_point') || syncing || unsynced_count === 0 || !online"
                      @click="sync">
          <md-icon>sync</md-icon>
          <span>Sync {{unsynced_count}} responses</span>
        </md-menu-item>

        <md-menu-item :disabled="!$can('write', 'irs_record_point') || syncing || unsynced_count === 0"
                      @click="download_records">
          <md-icon>file_download</md-icon>
          <span>Export {{unsynced_count}} unsynced</span>
        </md-menu-item>

      </template>

      <div v-if="$loading.anyLoading" slot="text">Loading...</div>

      <div v-if="!online" slot="text">
        Offline - unable to sync
      </div>

    </controls>

    <div class='applet_container'>
      <!-- LIST ALL -->
      <md-card>
        <md-card-header>
          <div class="md-title">{{responses.length}} responses ({{unsynced_count}} unsynced)</div>
        </md-card-header>
        <md-card-content>
          <md-input-container>
            <label>Find by {{filter_field}} or location</label>
            <md-input v-model="search_string"></md-input>
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
                      v-if="response.synced || response.uneditable"
                      :to="{name: 'irs_record_point:view', params: {response}}"
                  >{{format_response(response)}}
                  </router-link>

                  <router-link
                      v-else
                      :to="{name: 'irs_record_point:edit', params: {response_id: response.id}}"
                  >{{format_response(response)}}
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
  import {flatten, get} from 'lodash'

  import controls from 'components/controls.vue'
  import {ResponseController} from 'lib/models/response/controller'

  const controller = new ResponseController('record')

  const default_path = 'id'

  export default {
    name: 'List',
    components: {controls, virtual_list},
    data() {
      return {
        syncing: false,
        target_denominator: 0,
        search_string: '',
        responses: []
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        online: state => state.network_online,
        filter_field: state => get(state, 'instance_config.applets.irs_record_point.filter_field', default_path),
      }),
      filter_field_path() {
        if (this.filter_field !== default_path) {
          return `form_data.${this.filter_field}`
        } else {
          return default_path
        }
      },
      filtered_responses() {
        if (!this.responses.length) return []
        if (!this.search_string) return this.responses

        const regex = new RegExp(this.search_string.toLowerCase(), 'i')

        return this.responses
          .filter(r => {
            const got = get(r, this.filter_field_path, '').toString()
            return got.match(regex) || r.location.selection.name.match(regex)
          })
      },
      unsynced_count() {
        return this.unsynced_responses.length
      },
      unsynced_responses() {
        if (!this.responses.length) return []
        return this.responses.filter(r => !r.synced)
      }
    },
    async mounted() {
      await this.load_responses()
    },
    methods: {
      async load_responses() {
        this.$loading.startLoading('responses')
        const personalised_instance_id = this.$store.state.meta.personalised_instance_id
        const instance = this.$store.state.instance_config.instance.slug

        const found = await controller.read_all_cache({personalised_instance_id, instance})
        this.responses = found.sort((a, b) => new Date(b.recorded_on) - new Date(a.recorded_on))
        this.$loading.endLoading('responses')
      },
      format_response(response) {
        const location_name = get(response, 'location.selection.name', '')
        const ago = this.format_datetime_from_now(response.recorded_on)
        const filter_field_value = get(response, this.filter_field_path)

        return `${ago} in ${location_name} (${this.filter_field}: ${filter_field_value})`
      },
      format_datetime_from_now(date) {
        return moment(date).fromNow()//format('hh:mm a DD MMM YYYY')
      },
      format_datetime(date) {
        return moment(date).format('hh:mm a DD MMM YYYY')
      },
      async sync() {
        // Really is UI
        this.$loading.startLoading('irs_record_point/sync')
        this.syncing = true

        try {
          // TODO: Pass back counts instead of objects
          const results = await controller.create_records(this.unsynced_responses)
          const last_successful_sync_count = flatten(results.pass).length
          const last_failed_sync_count = flatten(results.fail).length

          this.$loading.endLoading('irs_record_point/sync')
          this.syncing = false

          // did any responses sync?
          if (last_successful_sync_count > 0) {
            this.$root.$emit('notify:toast', `Successfully synced ${last_successful_sync_count} responses`)
          } else if (last_successful_sync_count === 0 && last_failed_sync_count > 0) {
            setTimeout(() => {
              this.$root.$emit('notify:toast', `All ${last_failed_sync_count} responses failed to sync`)
            }, 3000)
          } else {
            setTimeout(() => {
              this.$root.$emit('notify:toast', `${last_successful_sync_count} responses synced, ${last_failed_sync_count} responses failed to sync`)
            }, 3000)
          }
          this.load_responses()
        } catch (e) {
          console.error(e)
          if (e.response && e.response.status !== 401) {
            this.$root.$emit('notify:toast', `Problem syncing responses`)
          }
          this.$loading.endLoading('irs_record_point/sync')
          this.syncing = false
        }
      },
      download_records() {
        const content = JSON.stringify(this.unsynced_responses)
        const date = moment().format('YYYY-MM-DD_HHmm')
        download(content, `${this.instance_config.instance.slug}_responses_export_${date}.json`)
      },
    }
  }

</script>
