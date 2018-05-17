<template>
  <div>
    <md-input-container>
      <label>Select season start date</label>
      <md-select :value="selected_start_date">
        <md-option v-for="(start_date, index) in season_start_dates" :key="start_date" :value="start_date" @selected="set_season(start_date, index)">
          {{start_date | format_date }}
        </md-option>
      </md-select>
    </md-input-container>
    <md-button @click="set_default_season">
      Set default season
    </md-button>
  </div>
</template>
<script>
  import moment from 'moment'
  import {isEqual} from 'lodash'

  export default {
    props: {
      season_start_dates: Array
    },
    computed: {
      selected_start_date: {
        get() {
          return this.$store.state.irs_monitor.dashboard_options.season_start_date
        },
        set(val) {
          this.$store.commit('irs_monitor/set_dashboard_option', {
            key: 'season_start_date',
            value: val
          })
        }
      }
    }, 
    filters: {
      format_date(date_int) {
        return moment(date_int).format('DD MMMM YYYY')
      }
    },
    methods: {
      set_season(start_date, index) {
        /*
        The season is inclusive of the season start date
        The season is exclusive of the season end date, unless it is the last season
         */
        const start_comparator = '>='
        const end_comparator = '<='

        const filters = this.$store.state.irs_monitor.filters

        const existing_start_date_filter = filters.find(f => isEqual(f.name, 'recorded_on') && isEqual(f.comparator, start_comparator))
        const existing_end_date_filter = filters.find(f => isEqual(f.name, 'recorded_on') && isEqual(f.comparator, end_comparator))

        if (existing_start_date_filter) {
          // remove filter
          this.$store.commit('irs_monitor/remove_filter', existing_start_date_filter)
        }

        if (existing_end_date_filter) {
          // remove filter
          this.$store.commit('irs_monitor/remove_filter', existing_end_date_filter)
        }

        // set UI date
        this.selected_start_date = start_date

        // emit start
        this.$store.commit('irs_monitor/add_filter', {
          name: 'recorded_on',
          comparator: start_comparator,
          value: new Date(start_date).getTime(),
          display_value: moment(new Date(start_date)).format("MMM Do YYYY")
        })

        // is last date
        if (index > 0) { // is not first date
          const end_date = moment(this.season_start_dates[index - 1]).subtract(1, 'day')
          //emit end
          this.$store.commit('irs_monitor/add_filter', {
            name: 'recorded_on',
            comparator: end_comparator,
            value: new Date(end_date).getTime(),
            display_value: end_date.format("MMM Do YYYY")
          })
        }




      },
      set_default_season() {
        const index = this.season_start_dates.length -  1
        const start_date = this.season_start_dates[0]
        this.set_season(start_date, 0)
      }
    }
  }
</script>

