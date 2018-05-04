<template>
  <div style="max-width: 600px; margin: 0 auto;">
    <md-card>
      <md-card-content>
        <span style="color: red;" class="md-error" v-if="error">{{error}}</span>

        <md-input-container>
          <label>Enter new season start date (YYYY-MM-DD)</label>
          <md-input v-model="new_season_start_date"></md-input>
        </md-input-container>

        <md-button class="md-raised md-primary" id="add_new_season" @click="push_date()">
          Add
        </md-button>

        <md-list>
          <md-list-item v-for="(season_start_date, index)  in season_start_dates" :key="season_start_date">
            {{season_start_date}}
            <span>
              <md-button @click="remove_season(index)" class="md-icon-button md-raised md-warn">
                <md-icon>delete</md-icon>
              </md-button>
            </span>
          </md-list-item>
        </md-list>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import {custom_validations} from '@locational/application-registry-validation'
  import {request_handler} from 'lib/remote/request-handler'

  export default {
    name: "seasons",
    data() {
      return {
        new_season_start_date: '',
        error: ''
      }
    },
    computed: {
      season_start_dates() {
        return this.$store.state.instance_config.applets.irs_monitor.season_start_dates.sort((a,b) => a>b)
      }
    },
    methods:{
      validate_seasons(season_start_dates) {
        const configuration = {
          applets: {
            irs_monitor: {
              season_start_dates
            }
          }
        }
        try {
          // TODO: Horrible!!!!
          custom_validations[5](configuration)
          return true
        } catch (e) {
          this.error = e.message
          return false
        }
      },
      push_date(){
        this.error = ""

        if (this.$store.state.instance_config.applets.irs_monitor.season_start_dates.includes(this.new_season_start_date)) {
          this.error = "That season start date has already been added"
          return 
        }

        const season_start_dates = [...this.$store.state.instance_config.applets.irs_monitor.season_start_dates, this.new_season_start_date]
        if (this.validate_seasons(season_start_dates)) {
          this.$store.state.instance_config.applets.irs_monitor.season_start_dates.push(this.new_season_start_date)
          this.new_season_start_date = ""
          this.save_config(this.$store.state.instance_config)
        }
      },
      remove_season(index){
        this.$store.state.instance_config.applets.irs_monitor.season_start_dates.splice(index, 1)
        this.save_config(this.$store.state.instance_config)
      },
      async save_config(config_data) {
        try {
          const res = await request_handler({
            method: 'post',
            data: {
              config_data
            },
            url_suffix: '/config'
          })
          console.log('res', res);
        } catch (e) {
          this.error = e.message
        }
      }
    }
  }
</script>

<style scoped>

</style>
