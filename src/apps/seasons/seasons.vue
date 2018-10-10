<template>
  <div style="max-width: 600px; margin: 0 auto;">
    <md-card>
      <md-card-content>

        <label>Enter new season start date</label>
        <div class="input-container">
          <masked-input
            class='masked-input'
            v-model="input_val"
            mask="####-##-##"
            :masked="true"
            placeholder="YYYY-MM-DD"
            @keyup.native.enter="add_season"
          />

          <md-button class="md-raised md-primary"
                     :disabled='network_active || invalid_date || already_exists || !input_ready' id="add_new_season"
                     @click="add_season">
            {{button_text__add}}
          </md-button>

          <!--Success and Errors-->
          <div class="errors">
            <span style="color: red;" v-if="input_ready && invalid_date">Invalid date</span>
            <span style="color: red;" v-if="input_ready && already_exists">Date already added</span>
            <span style="color: red;" v-if="error">{{error}}</span>
          </div>
        </div>

        <md-list>
          <md-list-item v-for="(season_start_date, index)  in sorted_season_start_dates" :key="season_start_date">
            {{season_start_date}}
            <span>
              <md-button @click="remove_season(index)" class="md-icon-button md-raised md-warn"
                         :disabled="network_active">
                <md-icon>delete</md-icon>
              </md-button>
            </span>
          </md-list-item>
        </md-list>
      </md-card-content>
    </md-card>
    <warning/>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import {TheMask as MaskedInput} from 'vue-the-mask'
  import moment from 'moment-mini'
  import warning from './components/warning'

  import {custom_validations} from '@locational/application-registry-validation'
  import {request_handler} from 'lib/remote/request-handler'

  export default {
    name: 'seasons',
    components: {MaskedInput, warning},
    data() {
      return {
        input_val: '',
        local_season_start_dates: [],

        error: '',
        network_active: false, // TODO: Could replace with $loading
      }
    },
    computed: {
      ...mapState({
        slug: state => state.instance_config.instance.slug,
        config_version: state => state.instance_config.config_version
      }),
      button_text__add() {
        return this.network_active ? 'saving...' : 'add'
      },
      sorted_season_start_dates() {
        return this.sort_season_start_dates(this.local_season_start_dates)
      },
      input_ready() {
        return /\d{4}\-\d{2}\-\d{2}/.test(this.input_val)
      },
      invalid_date() {
        return this.input_ready && !moment(this.input_val).isValid()
      },
      already_exists() {
        return this.local_season_start_dates.includes(this.input_val)
      }
    },
    watch: {
      input_val: function () {
        this.error = ''
      }
    },
    created() {
      this.create_local_season_start_dates()
    },
    methods: {
      create_local_season_start_dates() {
        this.local_season_start_dates = [...this.$store.state.instance_config.applets.irs_monitor.season_start_dates]
      },
      reset_ui() {
        this.input_val = ''
        this.network_active = false
        location.reload(true)
      },
      add_season() {
        this.error = ''
        const dates_to_save = [...this.local_season_start_dates, this.input_val]

        // Check if makes a valid configuration
        if (this.validate_seasons(dates_to_save)) {
          this.save_config(dates_to_save)
        } else {
          this.error = 'Selected date would create an invalid application configuration. Date not saved'
        }
      },
      remove_season(index) {
        const dates_to_save = [...this.local_season_start_dates]

        dates_to_save.splice(index, 1)
        this.save_config(dates_to_save)
      },
      validate_seasons(season_start_dates) {
        const test_configuration = {applets: {irs_monitor: {season_start_dates}}}

        try {
          custom_validations[5](test_configuration) // TODO: Horrible!!!! But works for now.
          return true
        } catch (e) {
          this.error = e.message
          return false
        }
      },
      async save_config(new_season_start_dates) {
        this.network_active = true

        try {
          const res = await request_handler({
            method: 'put',
            data: {
              seasons_start_dates: this.sort_season_start_dates(new_season_start_dates),
              config_id: this.slug,
              config_version: this.config_version
            },
            url_suffix: '/seasons'
          })

          this.reset_ui()
        } catch (e) {
          this.network_active = false
          this.error = e.message
        }
      },
      sort_season_start_dates(dates_array) {
        return dates_array.sort((a, b) => a < b)
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
