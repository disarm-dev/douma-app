<template>
  <div>
    <md-checkbox class='no-bottom-margin' :disabled="disabled" v-model="include_responses_outside_plan">Include responses outside plan</md-checkbox>
    <p v-if="include_responses_outside_plan" class="warn">
      The checkbox above means you are showing responses outside the plan. This will display responses on the map, but note that aggregations are calculated from the plan so they may be incorrect or missing.
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
      disabled() {
        if (!this.targets) return true
        return this.targets.length === 0
      },
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