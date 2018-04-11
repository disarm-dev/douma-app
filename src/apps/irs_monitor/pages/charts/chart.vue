<template>
  <div>

    <md-card-header>
      <div class="md-subheading">
        <b>{{chart_title}}</b>
      </div>
    </md-card-header>

    <div :id="chart_id"></div>

    <md-card-content v-if="!has_responses">
      <div><em>Not enough data to display chart (and who likes empty charts anyway?)</em></div>
    </md-card-content>

  </div>
</template>

<script>
  import Plotly from 'plotly.js/dist/plotly-basic.min.js'
  import {get} from 'lodash'

  import get_data from '../../lib/get_data_for_viz'
  import cache from 'config/cache'
  import CONFIG from 'config/common'


  export default {
    name: 'custom_chart',
    props: ['chart_id', 'responses', 'targets', 'aggregations', 'options'],
    watch: {
      'responses': 'get_chart_data',
      'chart_data': 'render_chart'
    },
    data() {
      return {
        chart_data: null,
        _chart: null
      }
    },
    computed: {
      chart_title() { return get(this.options, 'layout.title', 'No title') },
      has_responses() { return this.responses && this.responses.length !== 0}
    },
    created() {
      this.plotly_event_listeners = []
      this.data = []
    },
    mounted() {
      // this.render_chart()
    },
    beforeDestroy() {
      for(let fn of this.plotly_event_listeners) {
        window.removeEventListener('resize', fn)
        this.plotly_event_listeners.splice(0, 1)
      }
    },
    methods: {
      get_chart_data() {
        if (!this.has_responses) {
          return false
        }

        const geodata = cache.geodata // TODO: @refac When we fix geodata into store, etc
        const responses = this.responses
        const targets = this.targets
        const aggregations = this.aggregations
        const options = this.options

        // const func = get_data
        const params = {
          responses,
          targets,
          aggregations,
          options,
          geodata
        }

        this.chart_data = get_data(params)
      },
      render_chart() {
        console.time('render_chart')
        // If no responses and chart was previously rendered, then remove it and return
        // Do these checks to avoid rendering whole chart if data has changed
        if (!this.has_responses) {
          if (this._chart) Plotly.purge(this._chart)
          return false
        }

        // Check options not empty
        const options_layout = get(this.options, 'layout', {})
        const layout = {...CONFIG.applets.irs_monitor.chart_layout_defaults, ...options_layout}

        delete layout.title

        // Plotly#newPlot can be called multiple times, will update data, but not layout
        const displayModeBar = get(this.options, 'layout.displayModeBar', false)
        Plotly.newPlot(this.chart_id, this.chart_data, layout, {displayModeBar})
          .then((plot) => {
            this._chart = plot
            const fn = Plotly.Plots.resize.bind(this, plot)
            window.addEventListener('resize', fn, {passive: true})
            this.plotly_event_listeners.push(fn)
          })

        console.timeEnd('render_chart')
        return true
      }
    }
  }
</script>

<style lang="css" scoped>
</style>
