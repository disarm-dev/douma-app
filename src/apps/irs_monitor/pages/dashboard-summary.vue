<template>
  <controls>
    <md-button slot="primary_action" class="md-icon-button md-raised md-primary" :disabled="!$can('read', 'irs_monitor') || isLoading('irs_monitor/load_responses')" @click.native='load_data'>
      <md-icon>refresh</md-icon>
    </md-button>

    <template slot="menu_items">
      <md-menu-item :disabled="!$can('read', 'irs_monitor') || isLoading('irs_monitor/load_plan')" @click="load_plan">
        <md-icon>file_download</md-icon>
        <span>Load plan</span>
      </md-menu-item>

      <md-menu-item :disabled="!$can('read', 'irs_monitor') || isLoading('irs_monitor/load_responses')" @click="load_responses">
        <md-icon>file_download</md-icon>
        <span>Load responses</span>
      </md-menu-item>

      <md-menu-item :disabled="!$can('read', 'irs_monitor') || isLoading('irs_monitor/refresh_data') || !responses.length" @click="force_load_responses">
        <md-icon>file_download</md-icon>
        <span>Re-load all responses</span>
      </md-menu-item>

      <md-menu-item :disabled="!$can('read', 'irs_monitor') || isLoading('irs_monitor/refresh_data') || !responses.length" @click="download_responses">
        <md-icon>file_download</md-icon>
        <span>Download responses</span>
      </md-menu-item>

    </template>

    <div slot="text">
      <div v-if="filters.length">
        {{filters.length}} filters active, {{responses.length}} filtered records showing
      </div>
      <div v-else>
        {{responses.length}} records
        Last updated: {{responses_last_updated_at}}
      </div>
    </div>
  </controls>

</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import moment from 'moment-mini'
  import download from 'downloadjs'
  import json2csv from 'json2csv'

  import controls from 'components/controls.vue'

  export default {
    name: 'summary',
    components: {controls},
    props: ['responses', 'filters'],
    mounted() {
    },
    data() {
      return {}
    },
    computed: {
      ...mapState({
        plan: state => state.irs_monitor.plan,
        instance_config: state => state.instance_config,
        responses_last_updated_at: state => {
          if (state.irs_monitor.responses_last_updated_at) {
            return moment(state.irs_monitor.responses_last_updated_at).format("dddd, MMMM Do YYYY, h:mm:ss a")
          } else {
            return "not yet updated"
          }
        }
      }),
      ...mapGetters({
        isLoading: 'loading/isLoading'
      })
    },
    methods: {
      load_data() {
        this.load_responses()
        this.load_plan()
      },
      load_responses() {
        this.$emit('load_responses')
      },
      force_load_responses() {
        this.$emit('force_load_responses')
      },
      load_plan() {
        this.$emit('load_plan')
      },
      download_responses() {
        if(!this.responses.length) return

        const fields = Object.keys(this.responses[0])
        const data = this.responses
        const content = json2csv({data, fields})

        const date = moment().format('YYYY-MM-DD_HHmm')
        download(content, `${this.instance_config.instance.slug}_responses_${date}.csv`)
        this.$ga.event('irs_monitor','click_download_responses')
      }
    }
  }
</script>

<style scoped>
</style>
