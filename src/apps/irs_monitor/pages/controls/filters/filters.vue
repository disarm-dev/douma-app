<template>
  <div>
    <field_filters :responses="responses" @change="add_filter"></field_filters>

    <temporal_filter :responses="responses" @change="add_filter"></temporal_filter>

    <spatial_filter :filters="filters" @change="add_filter"></spatial_filter>

    <filters_summary :filters="filters" @remove_filter="remove_filter"></filters_summary>
  </div>
</template>

<script>
  import sort from 'alphanum-sort'
  import unique from 'array-unique'
  import {mapState} from 'vuex'

  import cache from 'config/cache'
  import {get_next_level_up_from_planning_level, get_all_spatial_hierarchy_level_names, get_planning_level_name, get_planning_level} from 'lib/instance_data/spatial_hierarchy_helper'

  import field_filters from './fields.vue'
  import temporal_filter from './temporal'
  import spatial_filter from './spatial'
  import filters_summary from './summary'

  export default {
    name: 'Filters',
    props: ['responses'],
    components: {filters_summary, field_filters, temporal_filter, spatial_filter},
    computed: {
      ...mapState({
        field_filter: state => state.irs_monitor.field_filter,
        filters: state => state.irs_monitor.filters,
      }),
    },
    methods: {
      add_filter(filter) {
        this.$store.commit('irs_monitor/add_filter', filter)
      },
      remove_filter(filter) {
        this.$store.commit('irs_monitor/remove_filter', filter)
      }
    }
//    mounted() {
//      if (this.filter) {
//        this.temporal = this.filter.temporal || {start: new Date(), end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
//        this.spatial.selected_filter_area_option = this.filter.spatial
//        this.spatial.spatial_hierarchy = this.filter.spatial.level || NO_SPATIAL_FILTER_OPTION
//        this.team = this.filter.team
//      }
//    },
//    methods: {
//      emit_filter() {
//        let filter = {}
//
//        if (this.enable_temporal_filter) {
//          filter.temporal = {
//            start: this.temporal.start,
//            end: this.temporal.end
//          }
//        }
//
//        const include_spatial_filter = this.spatial.selected_filter_area_option && this.spatial.selected_filter_area_option.hasOwnProperty('id')
//
//        if (this.planning_level_name !== NO_SPATIAL_FILTER_OPTION && include_spatial_filter) {
//          filter.spatial = {
//            level: this.planning_level_name, // TODO: @feature Actually allow users to select this value,
//            id: this.spatial.selected_filter_area_option.id,
//            name: this.spatial.selected_filter_area_option.name
//          }
//        }
//
//        if (this.team !== NO_TEAM_FILTER_OPTION) {
//          filter.team = this.team
//        }
//
//        this.$store.commit('irs_monitor/set_filter', filter)
//      },
//      select_team(team) {
//        this.team = team
//        this.emit_filter()
//      },
//      select_spatial_level(spatial_hierarchy) {
//        this.spatial.spatial_hierarchy = spatial_hierarchy
//        this.emit_filter()
//      },
//      select_area(area) {
//        this.spatial.selected_filter_area_option = area
//        this.emit_filter()
//      }
//    }
  }
</script>

<style scoped>
</style>
