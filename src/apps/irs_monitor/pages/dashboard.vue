<template>
  <div>
    <!--  SUMMARY, LOAD, DOWNLOAD (DUMPING GROUND) -->
    <dashboard_summary
        :responses='filtered_responses'
        :filters='filters'
        @load_responses="retrieve_responses"
        @force_load_responses="force_load_responses"
        @load_plan="load_plan"
    ></dashboard_summary>

    <div class='applet_container'>

      <!--DASHBOARD CONTROLS-->
      <controls :responses="filtered_responses" :targets="targets"></controls>

      <!--MAP-->
      <dashboard_map
        :responses="filtered_responses"
        :targets="targets"
        :aggregations="aggregations"
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
  import {cloneDeep as clone_deep} from 'lodash'

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

  const responses_controller = new ResponseController('record')
  const plan_controller = new PlanController('plan')

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
        responses: [],
        plan: null
      }
    },
    computed: {
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
      }),
      ...mapGetters({
        targets: 'irs_monitor/targets',
      }),
      filtered_responses() {
        const responses = this.responses
        if (!responses.length) return []
        return responses

        // responses: 'irs_monitor/filtered_responses',
        const dashboard_options = this.$store.state.dashboard_options
        const plan_target_area_ids = getters.plan_target_area_ids

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

        const filtered = filter_responses(limited_to_plan, this.$store.state.irs_monitor.filters)

        return filtered
      }
    },
    async created() {
      // hydrate
      const personalised_instance_id = this.$store.state.meta.personalised_instance_id
      const instance = this.$store.state.instance_config.instance.slug
      this.responses = await responses_controller.read_all_cache({personalised_instance_id, instance})
    },
    methods: {
      retrieve_responses() {
        this.$startLoading('irs_monitor/load_responses')

        this.$store.dispatch('irs_monitor/get_responses_remote')
          .then((responses) => {
            this.$endLoading('irs_monitor/load_responses')
            let message
            if (responses.length > 0) {
              message = `Successfully retrieved responses`
            } else {
              message = 'Successful retrieve, zero records found.'
            }
            this.$store.commit('root:set_snackbar', {message})
          })
          .catch(e => {
            this.$endLoading('irs_monitor/load_responses')
          })
      },
      force_load_responses() {
        this.$store.commit('irs_monitor/set_last_id', null)
        this.retrieve_responses()
      },
      async load_plan() {
        this.$startLoading('irs_monitor/load_plan')

        const plan_json = await plan_controller.read_plan_current_network()

        if (Object.keys(plan_json).length === 0) {
          return this.$store.commit('root:set_snackbar', {message: 'No plan loaded.'})
        }

        try {
          new Plan().validate(plan_json)
          this.plan = plan_json
          this.$endLoading('irs_monitor/load_plan')
          this.$store.commit('root:set_snackbar', {message: 'Successfully retrieved plan'})
        } catch (e) {
          console.log(e)
          this.$endLoading('irs_monitor/load_plan')
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
