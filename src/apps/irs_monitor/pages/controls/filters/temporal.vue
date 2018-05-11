<template>
  <div class="temporal-container">
    <div class="date-input">
      <b>From</b>
      <date-picker v-model="start" :disabledDates="{from: end}"></date-picker>
    </div>

    <div class="date-input">
      <b>To</b>
      <date-picker v-model="end" :disabledDates="{to: start}"></date-picker>
    </div>

    <div class="date-input">
      <md-button @click="add_temporal_filter">Add filter</md-button>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vuejs-datepicker';
import moment from 'moment-mini'

export default {
  name: 'temporal',
  props: ['responses', 'filters'],
  components: {DatePicker},
  data () {
    return {
      start: null,
      end: null,
    }
  },
  mounted() {
    this.set_start_and_end_dates()
  },
  methods: {
    set_start_and_end_dates() {
      if (!this.responses || !this.responses.length) return

      const dates = this.responses.map(record => new Date(record.recorded_on).getTime())

      this.start = new Date(Math.min(...dates))
      this.end = new Date(Math.max(...dates))
    },
    add_temporal_filter() {
      this.remove_other_temporal_filters()

      const start_filter = {
        name: 'recorded_on',
        comparator: '>=',
        value: new Date(this.start).getTime(),
        display_value: moment(new Date(this.start)).format("MMM Do YYYY")
      }

      this.$store.commit('irs_monitor/add_filter', start_filter)

      const end_filter = {
        name: 'recorded_on',
        comparator: '<=',
        value: new Date(this.end).getTime(),
        display_value: moment(new Date(this.end)).format("MMM Do YYYY")
      }

      this.$store.commit('irs_monitor/add_filter', end_filter)
    },
    // TODO: remove this, not component-y
    remove_other_temporal_filters() {
      if (!this.filters) return

      this.filters
        .filter(f => f.name === 'recorded_on')
        .forEach(f => {
          this.$store.commit('irs_monitor/remove_filter', f)
        })

    }
  }
};
</script>

<style lang="css" scoped>
  .date-input {
    display: inline-block;
  }

  .temporal-container {
    min-height: 330px;
  }
</style>
