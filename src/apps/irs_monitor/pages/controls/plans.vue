<template>
  <div>
    <h4>Plan</h4>
    <md-input-container>
      <label>Select plan</label>
      <md-select v-model="plan">
        <md-option v-for="plan in plans" :key="plan._id" :value="plan._id" @selected="get_plan(plan)">
          {{plan.date | format_date }}, {{plan.targets}} areas
        </md-option>
      </md-select>
    </md-input-container>
    <md-button>
      Reset to current plan
    </md-button>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import moment from 'moment'

  export default {
    // TODO: Pass in data as a prop
    computed: {
      ...mapState({
        plans: state => state.irs_monitor.plans,
      })/*,
      plan: {
        get() {
          return (this.$store.state.irs_monitor.plan || {} )._id
        },
        set(plan_id) {
          // TODO: Do this in a commit, not the component
          const plan = this.$store.state.irs_monitor.plans.find(plan => plan._id === plan_id)
          this.$store.commit('irs_monitor/set_plan', plan)
        }
      }*/
    },
    filters: {
      format_date(date_int) {
        return moment(date_int).format('DD MMMM YYYY')
      }
    },
    methods:{
      get_plan({_id}){
        console.log('Plan id',_id)
        this.$store.dispatch('irs_monitor/get_network_plan_detail',_id)
      }
    }
  }
</script>
