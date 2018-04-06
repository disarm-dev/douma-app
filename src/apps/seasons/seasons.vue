<template>
  <div style="max-width: 600px; margin: 0 auto;">
    <md-card>
      <md-card-container>
        <md-input-container>
          <label>Season start date</label>
          <md-input v-model="new_season_start_date"></md-input>
        </md-input-container>

        <md-button @click="push_date()">
          Add new season
        </md-button>


        <md-list>
          <md-list-item v-for="(season_start_date, index)  in season_start_dates" :key="season_start_date">
            {{season_start_date}}
            <span> 
              <md-button @click="remove_season(index)">
                Remove season
              </md-button>
            </span>
          </md-list-item>
        </md-list>
      </md-card-container>
    </md-card>
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
        this.new_season_start_date = ""
      },
      remove_season(index){
        this.$store.state.instance_config.applets.irs_monitor.season_start_dates.splice(index, 1)
      }
    }
  }
</script>

<style scoped>

</style>
