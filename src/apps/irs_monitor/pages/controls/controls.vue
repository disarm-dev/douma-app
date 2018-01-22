<template>
  <md-card class="card filter_select filter-container">
    <md-card-header>
      <div id="title" class="md-title" @click="show_filters = !show_filters">
        <md-icon v-if="show_filters">keyboard_arrow_down</md-icon>
        <md-icon v-else>keyboard_arrow_right</md-icon>
        Filters
        <span v-if="filters.length">({{filters.length}} active filters)</span>
      </div>
    </md-card-header>

    <md-card-content v-show="show_filters">
      <filters :responses="responses"></filters>
      <aggregation_settings :responses="responses" :targets="targets"></aggregation_settings>
      <limit_to :responses="responses" :targets="targets"></limit_to>
      <guess_locations :responses="responses"></guess_locations>
    </md-card-content>

  </md-card>
</template>

<script>
  import {mapState} from 'vuex'
  import aggregation_settings from './aggregation-settings.vue'
  import filters from './filters/filters.vue'
  import limit_to from './limit-to.vue'
  import guess_locations from './guess-locations'

  export default {
    name: 'controls',
    components: {filters, aggregation_settings, limit_to, guess_locations},
    props: ['responses', 'targets'],
    computed: {
      ...mapState({
        filters: state => state.irs_monitor.filters,
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
