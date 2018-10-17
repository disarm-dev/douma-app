<template>
  <div>
    <!--  SUMMARY, LOAD, DOWNLOAD (DUMPING GROUND) -->
    <dashboard_summary
      :responses='filtered_responses'
      :filters='filters'
      :plan="plan"
      @load_responses="retrieve_responses"
      @force_load_responses="force_load_responses"
      @load_plan="load_plan"
      @load_all_plans="load_all_plans"
    ></dashboard_summary>

    <div class='applet_container'>

      <!--DASHBOARD CONTROLS-->
      <controls :responses="filtered_responses" :plans="plans" @get_plan="get_network_plan_detail" :targets="targets"></controls>

      <!--MAP-->
      <dashboard_map
        :responses="filtered_responses"
        :targets="targets"
        :aggregations="aggregations"
        :plan_target_area_ids="plan_target_area_ids"
        :options="with_dashboard_options(map_options)">
      </dashboard_map>

      <!--TABLE-->
      <dashboard_table
        :responses="filtered_responses"
        :targets="targets"
        :aggregations="aggregations"
        :options="with_dashboard_options(table_options)">
      </dashboard_table>

      <!-- CUSTOM STATIC-DATA CHARTS, etc -->
      <charts
        v-if="chart_configs"
        :responses="filtered_responses"
        :targets="targets"
        :aggregations="aggregations"
        :options="with_dashboard_options(chart_configs)"></charts>
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import {get, cloneDeep as clone_deep} from 'lodash'

  // Components
  import dashboard_summary from './dashboard-summary.vue'
  import controls from './controls/controls.vue'
  import dashboard_map from './map/dashboard-map.vue'
  import dashboard_table from './table/dashboard-table.vue'
  import charts from './charts/dashboard-charts.vue'

  import {get_geodata} from 'lib/models/geodata/remote.js'
  import {ResponseController} from 'lib/models/response/controller'
  import {PlanController} from 'lib/models/plan/controller'
  import {Plan} from 'lib/models/plan/model'
  import {get_targets} from 'apps/irs_monitor/lib/aggregate_targets'
  import {filter_responses} from 'apps/irs_monitor/lib/filters'
  import {create_plan_from_all_geodata} from 'lib/instance_data/spatial_hierarchy_helper'
  import cache from 'config/cache'

  //import { isEqual, get } from 'lodash'

  let cached_responses = []

  const applet_name = 'monitor'
  const responses_controller = new ResponseController(applet_name)
  const plan_controller = new PlanController(applet_name)

  export default {
    name: 'Dashboard',
    components: {
      dashboard_summary,
      controls,
      dashboard_map,
      dashboard_table,
      charts,
    },
    data() {
      return {
        responses_length:0,
        plan: null,
        plans: []
      }
    },
    computed: {
      filtered_responses() {
        const responses = this.responses_length?cached_responses:[]//this.responses
        if (!responses.length) return []

        const dashboard_options = this.$store.state.irs_monitor.dashboard_options
        const plan_target_area_ids = this.plan_target_area_ids

        // limit to plan if 'dashboard_options.limit_to_plan' is true
        const limited_to_plan = responses.filter(r => {
          if (!dashboard_options.limit_to_plan) return true

          const id = get(r, 'location.selection.id', false)
          if (id) {
            return plan_target_area_ids.includes(id)
          } else {
            return false
          }
        })

        return filter_responses(limited_to_plan, this.$store.state.irs_monitor.filters)
      },
      plan_target_area_ids() {
        if (this.plan && this.plan.targets) {
          return this.plan.targets.map(target => target.id)
        } else {
          return []
        }
      },
      ...mapState({
        instance_config: state => state.instance_config,

        // Aggregations from instance_config
        aggregations: state => state.instance_config.aggregations,

        // Options
        filters: state => state.irs_monitor.filters,
        dashboard_options: state => state.irs_monitor.dashboard_options,

        // Options (passed to components)
        table_options: state => state.instance_config.applets.irs_monitor.table,
        map_options: state => state.instance_config.applets.irs_monitor.map,
        chart_configs: state => state.instance_config.applets.irs_monitor.charts,

        // responses metadata
        last_id: state => state.irs_monitor.last_id
      }),
      // ...mapGetters({
      //   targets: 'irs_monitor/targets',
      // }),

      targets() {
        let areas_to_include

        if (this.plan) {
          areas_to_include = this.plan.targets
        } else {
          areas_to_include = create_plan_from_all_geodata(cache)
        }

        const spatial_aggregation_level = this.dashboard_options.spatial_aggregation_level
        return get_targets(areas_to_include, spatial_aggregation_level)
      },
      plan_target_area_ids() {
        if (this.plan && this.plan.targets) {
          return this.plan.targets.map(target => target.id)
        } else {
          return []
        }
      }
    },
    async created() {
      // hydrate
      await this.load_responses()
      await this.load_plan()
      this.load_all_plans()
    },
    methods: {
      async load_responses() {
        const personalised_instance_id = this.$store.state.meta.personalised_instance_id
        const instance = this.$store.state.instance_config.instance.slug
        this.cache_responses(await responses_controller.read_all_cache({personalised_instance_id, instance}))
      //  debugger
      },

      cache_responses(response_list){
        cached_responses = response_list
        this.responses_length = cached_responses.length;

      },
      //endof getters
      //Startof actions
      get_responses_local: (context) => {
        const personalised_instance_id = this.$store.meta.personalised_instance_id
        const instance = this.$store.instance_config.instance.slug
        return response_controller.read_all_cache({personalised_instance_id, instance}).then(responses => {
          this.cache_responses(responses)
          debugger
        })
      },
      get_all_records: async (context) => {
        const last_id = this.last_id
        if (last_id == null) {
          this.$store.commit('irs_record_point/clear_responses_not_inVillage') //TODO Possibly refactor irs_record_point
          this.$store.commit('irs_record_point/clear_guessed_responses')
        }
        const responses = await response_controller.read_new_network_write_local(last_id)

        if (responses.length) {
          const updated_last_id = responses[responses.length - 1]._id
          this.last_id = updated_last_id
          this.$store.commit('root:set_snackbar', {message: 'Retrieving more records.'}, {root: true})
          this.$store.commit('update_responses_last_updated_at') //TODO This is used in irs_monitor, may
          return this.get_all_records()
        } else {
          this.$store.commit('root:set_snackbar', {message: 'Completed retrieving records. Updated map, table, charts.'}, {root: true})
          return this.get_responses_local()
        }

      },
      get_current_plan() {
        return plan_controller.read_plan_current_network()
          .then(plan_json => {
            if (Object.keys(plan_json).length === 0) {
              return this.$store.commit('root:set_snackbar', {message: 'No plan loaded.'}, {root: true})
            }

            try {
              new Plan().validate(plan_json)
              this.plan = plan_json
            } catch (e) {
              console.log(e)
            }
          })
      },
      get_network_plan_detail(plan_id) {
        plan_controller.read_plan_detail_network(plan_id).then(plan_json => {
          if (Object.keys(plan_json).length === 0) {
            return this.$store.commit('root:set_snackbar', {message: 'There is no remote plan. Please create one.'}, {root: true})
          }

          try {
            new Plan().validate(plan_json)

            let target_areas = plan_json.targets.map(area => {
              return area.id
            })

            this.plan = plan_json
            //TODO: Load responses for this plan
          } catch (e) {
            console.error(e)
            this.$store.commit('root:set_snackbar', {message: 'ERROR: Plan is not valid'}, {root: true})
          }

        })
      },
      get_network_plan_list: (context) => {
        return plan_controller.read_plan_list_network().then(plan_json => {
          if (Object.keys(plan_json).length === 0) {
            return this.$store.commit('root:set_snackbar', {message: 'There is no remote plan. Please create one.'}, {root: true})
          }
          this.plans = plan_json
          return plan_json
        })
      },

      async retrieve_responses() {
        this.$loading.startLoading('irs_monitor/load_responses')

        const last_id = this.last_id

        // Guessing
        if (last_id == null) {
          console.log('🚒 what is happening with guessing stuff')
          // store.commit('irs_record_point/clear_responses_not_inVillage')
          // store.commit('irs_record_point/clear_guessed_responses')
        }
        
        let remote_responses_batch
        try {
          remote_responses_batch = await responses_controller.read_new_network_write_local(last_id)
        } catch (e) {
          this.$store.commit('root:set_snackbar', {message: 'Error retrieving records. Try again later'})
          this.$loading.endLoading('irs_monitor/load_responses')
          return
        }
        
        if (remote_responses_batch.length) {
          const updated_last_id = remote_responses_batch[remote_responses_batch.length - 1]._id
          this.$store.commit('irs_monitor/set_last_id', updated_last_id) //left in store because it has to be persisted
          this.$store.commit('root:set_snackbar', {message: 'Retrieving more records.'})
          this.$store.commit('irs_monitor/update_responses_last_updated_at') //Left in store because it has to b persisted
          return this.retrieve_responses()
        } else {
          this.$store.commit('root:set_snackbar', {message: 'Completed retrieving records. Updated map, table, charts.'})
          await this.load_responses()

          let message
          if (cached_responses.length > 0) {
            message = `Successfully retrieved responses`
          } else {
            message = 'Successful retrieve, zero records found.'
          }
          this.$store.commit('root:set_snackbar', {message})
          this.$loading.endLoading('irs_monitor/load_responses')
        }
      },
      force_load_responses() {
        this.$store.commit('irs_monitor/set_last_id', null)
        this.retrieve_responses()
      },
      load_all_plans() {
        this.$loading.startLoading('irs_monitor/load_all_plans')

        this.get_network_plan_list()
          .then((plans) => {
            this.$loading.endLoading('irs_monitor/load_all_plans')
            this.$store.commit('root:set_snackbar', {message: 'Successfully retrieved all plans'})
            this.plans = plans
          })
          .catch(e => {
            this.$loading.endLoading('irs_monitor/load_all_plans')
          })
      },
      async load_plan() {
        this.$loading.startLoading('irs_monitor/load_plan')

        const plan_json = await plan_controller.read_plan_current_network()

        this.$loading.endLoading('irs_monitor/load_plan')

        if (Object.keys(plan_json).length === 0) {
          return this.$store.commit('root:set_snackbar', {message: 'No plan loaded.'})
        }

        try {
          new Plan().validate(plan_json)
          this.plan = plan_json
          this.$store.commit('root:set_snackbar', {message: 'Successfully retrieved plan'})
        } catch (e) {
          console.log(e)
          this.$loading.endLoading('irs_monitor/load_plan')
        }
      },
      with_dashboard_options(options) {
        if (Array.isArray(options)) {
          // We have an array of chart configurations
          const chart_configs = options

          const dashboard_options_clone = clone_deep(this.dashboard_options)
          delete dashboard_options_clone.bin_by

          return chart_configs.map(config => {
            let clone = clone_deep(config)
            clone.options = {
              filters: this.filters,
              ...clone.options,
              ...dashboard_options_clone
            }
            return clone
          })

        } else {
          // Just have a simple `options` object (for either map or table)
          return {
            filters: this.filters,
            ...options,
            ...this.dashboard_options
          }
        }
      }
    }
  }
</script>

<style scoped>
  .card {
    display: inline-block;
    margin: 1% 2.5%;
    flex: 1;
    width: 95%;
  }
</style>
