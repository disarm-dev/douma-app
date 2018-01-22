<template>
  <div class="border-line">
    <h4>Aggregation settings</h4>
    <p>
      Spatial aggregation level
      <md-button-toggle md-single>
        <md-button v-for="level in spatial_level_names" :key="level"
                   @click="set_spatial_aggregation_level(level)"
                   class="md-button"
                   :class="{'md-toggle': level === spatial_aggregation_level}">
          {{level}}
        </md-button>
      </md-button-toggle>
    </p>

    <p>
      Temporal aggregatation level
      <md-button-toggle md-single>
        <md-button v-for="level in temporal_level_names" :key="level"
                   @click="set_temporal_aggregation_level(level)"
                   class="md-button"
                   :class="{'md-toggle': level === temporal_aggregation_level}">
          {{level}}
        </md-button>
      </md-button-toggle>
    </p>


    <!-- OPTIONS: all, responses, plan -->
    <!--<limit_to-->
      <!--:responses="responses"-->
      <!--:targets="targets"-->
      <!--:selected_limit="limit_to"-->
      <!--@change="select_limit"-->
    <!--&gt;</limit_to>-->

  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import {
    get_next_level_up_from_planning_level,
    get_planning_level_name
  } from 'lib/instance_data/spatial_hierarchy_helper'
  import CONFIG from 'config/common'

  import limit_to from './limit-to.vue'

  /**
   * Control various elements of the dashboard. Any settings here cascade down to all tables, maps, charts.
   * Primary controls to set here:
   *  - spatial_aggregation_level: one of the geodata spatial levels (including the planning level and upwards)
   *  - temporal_aggregation_level: ['weeks', 'months', 'quarters', etc]. As per `moment-range` (https://github.com/rotaready/moment-range#by)
   */
  export default {
    name: 'aggregation-settings',
    props: ['responses', 'targets'],
    components: {limit_to},
    computed: {
      ...mapState({
        dashboard_options: state => state.irs_monitor.dashboard_options,
        spatial_aggregation_level: state => state.irs_monitor.dashboard_options.spatial_aggregation_level,
        temporal_aggregation_level: state => state.irs_monitor.dashboard_options.temporal_aggregation_level,
        limit_to: state => state.irs_monitor.dashboard_options.limit_to
      }),
      spatial_level_names() {
        const levels = [get_planning_level_name()]
        if (get_next_level_up_from_planning_level()) {
          levels.unshift(get_next_level_up_from_planning_level().name)
        }
        return levels
      },
      temporal_level_names() {
        return CONFIG.temporal_intervals
      }
    },
    created() {
      this.create_defaults()
    },
    methods: {
      create_defaults() {
        if (!this.dashboard_options.spatial_aggregation_level) {
          const planning_level_name = get_planning_level_name()
          this.set_spatial_aggregation_level(planning_level_name)
        }
      },
      set_spatial_aggregation_level(level) {
        const planning_level_name = get_planning_level_name()
        const is_planning_level = planning_level_name === level

        const new_options = {
          ...this.dashboard_options,
          spatial_aggregation_level: level,
          bin_by: is_planning_level ? 'location.selection.id' : "location.selection.category"
        }
        this.$store.commit('irs_monitor/set_dashboard_options', new_options)
      },
      set_temporal_aggregation_level(level) {
        const new_options = {
          ...this.dashboard_options,
          temporal_aggregation_level: level
        }
        this.$store.commit('irs_monitor/set_dashboard_options', new_options)
      },
      select_limit(limit_type) {
        this.$store.commit('irs_monitor/set_dashboard_option', {key: 'limit_to', value: limit_type})
      },
    }
  }
</script>

<style scoped>
  .border-line {
    border-top: 1px solid #ececec;
  }
</style>
