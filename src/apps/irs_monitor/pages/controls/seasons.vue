<template>
  <div>
    <h4>Seasons</h4>
    <md-input-container>
      <label>Select season start date</label>
      <md-select :value="selected_start_date">
        <md-option v-for="(start_date, index) in season_start_dates" :key="start_date" :value="start_date" @selected="add_temporal_filter(start_date, index)">
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
  export default {
    props: {
      season_start_dates: Array
    },
    data() {
      return {
        selected_start_date: ''
      }
    },
    filters: {
      format_date(date_int) {
        return moment(date_int).format('DD MMMM YYYY')
      }
    },
    methods: {
      add_temporal_filter(start_date, index) {
        this.selected_start_date = start_date
        let end_date

        // is last date
        if ((this.season_start_dates.length - 1) === index) {
          end_date = new Date()
        } else { // is not last date
          end_date = this.season_start_dates[index+1]
        }

        // emit start
        this.$store.commit('irs_monitor/add_filter', {
          name: 'recorded_on',
          comparator: '>',
          value: new Date(start_date).getTime(),
          display_value: moment(new Date(start_date)).format("MMM Do YYYY")
        })

        //emit end
        this.$store.commit('irs_monitor/add_filter', {
          name: 'recorded_on',
          comparator: '<',
          value: new Date(end_date).getTime(),
          display_value: moment(new Date(end_date)).format("MMM Do YYYY")
        })
      },
      set_default_season() {
        const index = this.season_start_dates.length -  1
        const start_date = this.season_start_dates[index]
        this.add_temporal_filter(start_date, index)
      }
    }
  }
</script>

