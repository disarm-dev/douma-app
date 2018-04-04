<template>
  <div>
    <h4>Plan</h4>
    <md-input-container>
      <label>Select plan</label>
      <md-select>
        <md-option v-for="plan in plans" :key="plan._id" :value="plan._id" @selected="get_plan(plan)">
          {{plan.date | format_date }}, {{plan.targets}} areas
        </md-option>
      </md-select>
    </md-input-container>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import moment from 'moment'

  export default {
    props: {
      'plans': Array
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
