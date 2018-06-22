<template>
  <div style="max-width: 600px; margin: 0 auto;">
    <md-card>
      <md-card-content>

        <label>Enter new season start date</label>
        <div class="input-container">
          <masked-input class='masked-input' v-model="input_val" mask="1111-11-11" placeholder="YYYY-MM-DD"/>

          <md-button class="md-raised md-primary" :disabled='network_active || invalid_date || !input_ready' id="add_new_season" @click="add_season">
            {{add_button_text}}
          </md-button>

          <!--Errors-->
          <div style="color: red;" v-if="input_ready && invalid_date">{{this.input_val}} is not a valid date</div>
          <div style="color: green;" v-if="input_ready && !invalid_date">{{this.input_val}} is a valid date</div>
          <div style="color: red;" v-if="error">{{error}}</div>
        </div>


        <md-list>
          <md-list-item v-for="(season_start_date, index)  in sort_season_start_dates" :key="season_start_date">
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
  import MaskedInput from 'vue-masked-input'
  import moment from 'moment-mini'
  window.m = moment

  import {custom_validations} from '@locational/application-registry-validation'
  import {request_handler} from 'lib/remote/request-handler'
  import {retrieve_local_config, save_local_config} from 'lib/models/instance_config/model'

  export default {
    name: 'seasons',
    components: {MaskedInput},
    data() {
      return {
        cloned_season_start_dates: [],
        input_val: '',

        error: '',
        network_active: false,
      }
    },
    computed: {
      add_button_text() {
        return this.network_active ? 'saving...' : 'add'
      },
      sort_season_start_dates() {
        return this.cloned_season_start_dates.sort((a, b) => a > b)
      },
      input_ready() {
        return /\d{4}\-\d{2}\-\d{2}/.test(this.input_val)
      },
      invalid_date() {
        return !moment(this.input_val).isValid()
      }
    },
    created() {
      this.cloned_season_start_dates = [...this.$store.state.instance_config.applets.irs_monitor.season_start_dates]
    },
    methods: {
      add_season() {
        this.error = ''
        this.network_active = true

        // Do not add if already exists
        if (this.cloned_season_start_dates.includes(this.input_val)) {
          this.error = 'That season start date has already been added'
          this.network_active = false
          return
        }

        const new_season_start_dates = [...this.cloned_season_start_dates, this.input_val]

        // Check if makes a valid configuration
        if (this.validate_seasons(new_season_start_dates) ) {
          this.cloned_season_start_dates.push(this.input_val)
          this.input_val = ''
          this.save_config(this.input_val)
        }
      },
      remove_season(index) {
        this.error = ''
        this.network_active = true

        this.cloned_season_start_dates.splice(index, 1)
        this.save_config(this.cloned_season_start_dates)
      },
      validate_seasons(season_start_dates) {
        const configuration = {
          applets: {
            irs_monitor: {
              season_start_dates
            }
          }
        }

        try {
          custom_validations[5](configuration) // TODO: Horrible!!!! But works for now.
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
      async save_config() {
        try {
          const res = await request_handler({
            method: 'post',
            data: {
              config_data: this.$store.state.instance_config
            },
            url_suffix: '/config'
          })
          await save_local_config(this.$store.state.instance_config)
        } catch (e) {
          this.error = e.message
        }
      }
    }
  }
</script>

<style scoped>
  .input-container {
    display: flex;
  }
  .input-child {
    flex-grow: 1;
  }
  .masked-input {
    background: #f5f5f5;
    border: 0;
    font-size: 1em;
    padding: 2px 10px 3px 10px;
    width: 120px;
    display: block;
  }
  .masked-input:focus {
    border: 0;
    outline: 1px solid gainsboro;
  }

</style>
