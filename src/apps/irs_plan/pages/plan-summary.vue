<template>
  <div>
    <h3>Selected {{planning_level_name}}:</h3>
    <md-button class='md-raised md-primary' @click.native="download_plan">Download plan table</md-button>
    <v-client-table
      v-if="selected_target_area_ids.length !== 0"
      :data="table.data"
      :columns="table.columns"
    ></v-client-table>
  </div>
</template>

<script>
  import download from 'downloadjs'
  import moment from 'moment-mini'
  import {mapState, mapGetters} from 'vuex'

  import cache from 'config/cache.js'
  import {get_planning_level_name} from 'lib/instance_data/spatial_hierarchy_helper'
  import {flatten_json_to_csv} from 'lib/helpers/csv-export'

  export default {
    name: 'plan_summary',
    props: ['edit'],
    data() {
      return {
        calculator: {
          enumerables: 40,
          teams: 20
        },
      }
    },
    computed: {
      ...mapState({
        slug: state => state.instance_config.instance.slug,
        table_output: state => state.instance_config.applets.irs_plan.table_output
      }),
      ...mapGetters({
        selected_target_area_ids: 'irs_plan/all_selected_area_ids'
      }),
      planning_level_name() {
        return get_planning_level_name()
      },
      selected_areas() {
        return cache.geodata[this.planning_level_name].features.filter(feature => {
          return this.selected_target_area_ids.includes(feature.properties.__disarm_geo_id)
        })
      },
      table() {
        const properties = this.selected_areas.map(r => r.properties)
        const data = properties.map((properties_object) => {
          return this.table_output.reduce((row, {display_name, source_field}) => {
            row[display_name] = properties_object[source_field]
            return row
          }, {})
        })

        const columns = Object.keys(data[0] || {})
        return {data, columns}
      },
    },
    methods: {
      download_plan() {
        if (this.table.data.length === 0) return

        const content = flatten_json_to_csv(this.table.data)
        const date = moment().format('YYYY-MM-DD_HHmm')

        download(content, `${this.slug}_irs_plan_${date}.csv`)
        this.$ga.event('irs_plan','click_download_plan')
      }
    }
  }
</script>
