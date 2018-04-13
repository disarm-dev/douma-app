<template>
  <md-card class="card">
    <md-card-content>

      <v-client-table v-if="responses.length" :data="table_data" :columns="table_columns"></v-client-table>
      <md-button @click.native="download_aggregations">Download</md-button>

    </md-card-content>
  </md-card>
</template>

<script>
  import download from 'downloadjs'
  import moment from 'moment-mini'

  import get_data from '../../lib/get_data_for_viz'
  import cache from 'config/cache'
  import {flatten_json_to_csv} from 'lib/helpers/csv-export'

  export default {
    props: ['responses', 'targets', 'aggregations', 'options'],
    computed: {
      table_columns() {
        return Object.keys(this.table_data[0])
      },
      table_data() {
        const geodata = cache.geodata // TODO: @refac When we fix geodata into store, etc

        const data = get_data({
          responses: this.responses,
          targets: this.targets,
          aggregations: this.aggregations,
          options: this.options,
          geodata: geodata
        })

        return data
      }
    },
    methods: {
      download_aggregations(){
        if (this.table_data.length === 0) return
        // TODO: @refac can abstract the download functionality - similar used in multiple places
        const content = flatten_json_to_csv(this.table_data)

        const date = moment().format('YYYY-MM-DD_HHmm')
        const slug = this.$store.state.instance_config.instance.slug

        download(content, `${slug}_irs_progress_${date}.csv`)
        this.$ga.event('irs_monitor','click_download_progress_table')
      }
    }
  }
</script>
