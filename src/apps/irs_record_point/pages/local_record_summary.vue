<template>
  <div>
    <md-input-container>
      <label>Target denominator for today</label>
      <md-input v-model='target_denominator' type='number'></md-input> 
    </md-input-container>
    <h2>LOCAL Summary of your (recent?) activity</h2>
    <ul>
      <h4>Standard calculations</h4>
      <li>completed {{total_structures}} records out of {{target_denominator}} ({{(total_structures / target_denominator)*100}} %)</li>
      <md-progress :md-progress="(total_structures / target_denominator)*100"></md-progress>
      <li>earliest -> latest (i.e. duration working): 3hrs</li>

      <h4>Plus the standard aggregations (minus any requring denominator)</h4>
      <li>number structures/rooms/households sprayed: 5</li>
      <li>number of refusals: 5</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'local_record_summary',
    data () {
      return {
        total_structures: 25,
        target_denominator: 30
      }
    }
  }
</script>

<style lang="css" scoped>
</style>