<template>
  <div class="charts">
    <md-card
      v-for="chart in options"
      :key="chart.id"
      class="chart"
      :class="{'card-half-width': chart.style.width_constraint == 'half'}">

        <text_widget
          v-if="chart.chart_type && chart.chart_type === 'text'"
          :chart_id="chart.id"
          :responses="responses"
          :targets="targets"
          :aggregations="aggregations"
          :options="chart.options"
        >

        </text_widget>

        <custom_chart
          v-else
          :chart_id="chart.id"
          :responses="responses"
          :targets="targets"
          :aggregations="aggregations"
          :options="chart.options"
        >
        </custom_chart>
    </md-card>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import custom_chart from './chart.vue'
  import text_widget from './text.vue'

  export default {
    name: 'custom-charts',
    props: ['responses', 'targets', 'aggregations', 'options'], // `options` is an array of chart configurations
    components: {custom_chart, text_widget}
  }
</script>

<style scoped>
  .charts {
    display: flex;
    flex-flow: row wrap;
  }

  .chart {
    margin: 0.5em;
    flex: 1 1 calc( 33% - 1em );
    min-width: 280px;
  }
</style>
