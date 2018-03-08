<template>
  <div>
    <h4>Plan</h4>
    <md-input-container>
      <label>Select plan</label>
      <md-select v-model="plan">
        <md-option v-for="plan in plans" :key="plan._id" :value="plan._id">
          <!-- TODO: Format the date with moment -->
          {{plan.updated_at}}
        </md-option>
      </md-select>
    </md-input-container>
  </div>
</template>
<script>
  import {mapState} from 'vuex'

  export default {
    // TODO: Pass in data as a prop
    computed: {
      ...mapState({
        plans: state => state.irs_monitor.plans,
      }),
      plan: {
        get() {
          return (this.$store.state.irs_monitor.plan || {} )._id 
        },
        set(plan_id) {
          // TODO: Do this in a commit, not the component
          const plan = this.$store.state.irs_monitor.plans.find(plan => plan._id === plan_id)
          this.$store.commit('irs_monitor/set_plan', plan)
        }
      }
    }
  }
</script>
