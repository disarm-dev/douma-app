<template>
  <div>
    <md-checkbox class='no-bottom-margin' v-model="include_responses_outside_plan">Include Responses and geodata outside Plan</md-checkbox>
    <p v-if="include_responses_outside_plan" class="warn">
      The checkbox above means you are showing responses outside the plan. This will display responses on the map and include them in aggregation calculations, but note that they will not be included in any coverage calculations.
      Uncheck to limit responses to the plan.
    </p>
  </div>
</template>

<script>
  import {get} from 'lodash'

  import CONFIG from 'config/common'

  export default {
    name: 'limit-to',
    props: ['responses', 'targets', 'selected_limit'],
    computed: {
      include_responses_outside_plan: {
        get() {
          return !this.$store.state.irs_monitor.dashboard_options.limit_to_plan
        },
        set(val) {
          const options = {
            ...this.$store.state.irs_monitor.dashboard_options,
            limit_to_plan: !val
          }
          this.$store.commit('irs_monitor/set_dashboard_options', options)
        }
      }
    }
  }

</script>

<style scoped>
  p.warn {
    color: orangered;
    margin-top: 0;
    margin-left: 28px;
  }
  .no-bottom-margin {
    margin-bottom: 0;
  }
</style>