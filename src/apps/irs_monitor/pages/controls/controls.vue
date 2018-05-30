<template>
  <md-card class="card filter_select">
    <md-card-header>
      <div id="title" class="md-title" @click="show_filters = !show_filters">
        <md-icon v-if="show_filters">keyboard_arrow_down</md-icon>
        <md-icon v-else>keyboard_arrow_right</md-icon>
        Controls
        <span v-if="filters.length">({{filters.length}} active filters)</span>
      </div>
    </md-card-header>

    <md-card-content v-show="show_filters">
      <md-tabs class="md-transparent filter-container" ref="tabs">

        <md-tab id="season_plan" md-label="Season/plan">
          <seasons :season_start_dates="season_start_dates"></seasons>
          <plans :plans="plans" @get_plan="get_plan"></plans>
        </md-tab>

        <md-tab id="form_field_filters" md-label="form Fields">
          <fields_filters :responses="responses"></fields_filters>
        </md-tab>

        <md-tab id="temporal_filters" md-label="temporal filter">
          <temporal_filter :filters="filters" :responses="responses"></temporal_filter>
        </md-tab>

        <md-tab id="spatial_filters" md-label="spatial filter">
          <spatial_filter :filters="filters" :responses="responses"></spatial_filter>
        </md-tab>

        <md-tab id="aggregations" md-label="aggregations">
          <aggregation_settings :responses="responses" :targets="targets"></aggregation_settings>
        </md-tab>

        <md-tab id="advanced" :md-label="advanced_label">
          <advanced_controls :responses='responses' :targets='targets'></advanced_controls>
        </md-tab>
      </md-tabs>

      <filters_summary :filters="filters"></filters_summary>

    </md-card-content>

  </md-card>
</template>

<script>
  import {mapState} from 'vuex'
  import aggregation_settings from './aggregation-settings.vue'
  import plans from './plans'
  import seasons from './seasons'
  import advanced_controls from './advanced_controls'
  import filters_summary from './filters/summary'
  import fields_filters from './filters/fields'
  import temporal_filter from './filters/temporal'
  import spatial_filter from './filters/spatial'


  export default {
    name: 'controls',
    components: {filters_summary, plans, seasons, temporal_filter, spatial_filter, fields_filters,  aggregation_settings, advanced_controls, },
    props: ['responses', 'targets', 'plans'],
    computed: {
      ...mapState({
        filters: state => state.irs_monitor.filters,
        //plans: state => state.irs_monitor.plans,
        season_start_dates: state => state.instance_config.applets.irs_monitor.season_start_dates.sort((a, b)=> a < b),
        advanced_label: state => {
          const advanced_active = state.irs_monitor.dashboard_options.limit_to_plan
          return advanced_active ? 'advanced' : 'advanced*'
        }
      }),
      show_filters: {
        get(){
          return this.$store.state.irs_monitor.ui.show_filters
        },
        set(val){
          if (this.$refs.tabs.activeTab === 'season_plan') this.$refs.tabs.setActiveTab(this.$refs.tabs.tabList['season_plan'])
          this.$store.commit('irs_monitor/set_ui', {show_filters: val})
        }
      },
    },
    methods:{
      get_plan(_id){
        this.$emit('get_plan',_id)
      }
    }
  }
</script>

<style scoped>
  .md-card-header {
    cursor: pointer;
  }

  #title {
    margin-top: 0;
  }
</style>
