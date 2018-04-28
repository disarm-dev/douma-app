<template>
  <md-card class="card filter_select filter-container">
    <md-card-header>
      <div id="title" class="md-title" @click="show_filters = !show_filters">
        <md-icon v-if="show_filters">keyboard_arrow_down</md-icon>
        <md-icon v-else>keyboard_arrow_right</md-icon>
        Controls
        <span v-if="filters.length">({{filters.length}} active filters)</span>
      </div>
    </md-card-header>

    <md-card-content v-show="show_filters">
      <md-tabs class="md-transparent">

        <md-tab id="season_plan" md-label="Season/plan">
          <seasons :season_start_dates="season_start_dates"></seasons>
          <plans :plans="plans"></plans>
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

        <md-tab id="advanced" md-label="advanced">
          <limit_to :responses="responses" :targets="targets"></limit_to>
          <guess_locations :responses="responses"></guess_locations>
        </md-tab>
      </md-tabs>
      <filters_summary :filters="filters"></filters_summary>

    </md-card-content>

  </md-card>
</template>

<script>
  import {mapState} from 'vuex'
  import aggregation_settings from './aggregation-settings.vue'
  import limit_to from './limit-to.vue'
  import guess_locations from './guess-locations'
  import plans from './plans'
  import seasons from './seasons'
  import filters_summary from './filters/summary'
  import fields_filters from './filters/fields'
  import temporal_filter from './filters/temporal'
  import spatial_filter from './filters/spatial'


  export default {
    name: 'controls',
    components: {filters_summary, temporal_filter, spatial_filter, fields_filters,  aggregation_settings, limit_to, guess_locations, plans, seasons},
    props: ['responses', 'targets'],
    computed: {
      ...mapState({
        filters: state => state.irs_monitor.filters,
        plans: state => state.irs_monitor.plans,
        season_start_dates: state => state.instance_config.applets.irs_monitor.season_start_dates.sort((a,b)=>a<b)
      }),
      show_filters: {
        get(){
          return this.$store.state.irs_monitor.ui.show_filters
        },
        set(val){
          this.$store.commit('irs_monitor/set_ui', {show_filters: val})
        }
      }
    },
  }
</script>

<style scoped>
  .md-card-header {
    cursor: pointer;
  }

  #title {
    margin-top: 0;
  }

  .filter-container {
    z-index: 2;
    overflow: visible;
  }
</style>
