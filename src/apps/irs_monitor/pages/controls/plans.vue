<template>
  <div>
    <h4>Plan</h4>
    <md-input-container>
      <label v-if="plans.length === 0">No plans loaded - create a Plan then click 'Load plans' in menu above</label>
      <label v-else>Select plan</label>
      <md-select :value="selected_plan" :disabled="plans.length === 0">
        <md-option v-for="plan in plans" :key="plan._id" :value="plan._id" @selected="get_plan(plan)">
          {{plan.date | format_date }}, {{plan.targets}} areas
        </md-option>
      </md-select>
    </md-input-container>
    <md-button @click="set_default_plan">
      Set default plan
    </md-button>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import moment from 'moment'

  export default {
    props: {
      'plans': Array
    },
    data() {
      return {
        selected_plan: ''
      }
    },
    filters: {
      format_date(date_int) {
        return (new Date(date_int)).toLocaleString()
      }
    },
    methods:{
      get_plan({_id}){
        console.log('Plan id',_id)
        this.selected_plan = _id
        this.$store.dispatch('irs_monitor/get_network_plan_detail',_id)
      },
      set_default_plan() {
        if (!this.plans.length) return

        const index = this.plans.length - 1
        const plan = this.plans[index]
        this.get_plan(plan)
      }
    }
  }
</script>
