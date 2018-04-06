<template>
<div>
  <md-input-container>
    <label>Season start date</label>
    <md-input v-model="new_season_start_date"></md-input>
  </md-input-container>

  <md-button @click="push_date()">
    Add new season
  </md-button>


  <md-list>
    <md-list-item v-for="season_start_date in season_start_dates" :key="season_start_date">
      {{season_start_date}}
      <span> <md-button @click="remove_season(season_start_date)">
    Remove season
  </md-button></span>
    </md-list-item>
  </md-list>
</div>
</template>

<script>
  export default {
    name: "seasons",
    data() {
      return {
        new_season_start_date: ''
      }
    },
    computed: {
      season_start_dates() {
        return this.$store.state.instance_config.applets.irs_monitor.season_start_dates.sort((a,b) => a>b)
      }
    },
    methods:{
      push_date(){
        this.$store.state.instance_config.applets.irs_monitor.season_start_dates.push(this.new_season_start_date)
      },
      remove_season(season){

      }
    }
  }
</script>

<style scoped>

</style>
