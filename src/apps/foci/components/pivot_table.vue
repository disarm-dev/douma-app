<template>
  <md-table>
  <md-table-header>
    <md-table-row>
      <md-table-head>
        {{y_axis_property}}
          /
        {{x_axis_property}}
      </md-table-head>
      <md-table-head v-for="x in x_axis_enums" :key="x" md-numeric>{{x_axis_property}}: {{x}}</md-table-head>
    </md-table-row>
  </md-table-header>

  <md-table-body>
    <md-table-row v-for="y in y_axis_enums" :key="y">
      <md-table-cell>{{y_axis_property}}: {{y}}</md-table-cell>
      <md-table-cell class="data-field" v-for="x in x_axis_enums" :key="x" md-numeric @click.native="handle_click(x_axis_property, x, y_axis_property, y)">
        {{get_data_for(x_axis_property, x, y_axis_property, y)}}
      </md-table-cell>
    </md-table-row>
  </md-table-body>
</md-table>
</template>
<script>
export default {
  props: {
    data: Array,
    x_axis_property: String,
    x_axis_enums: Array,
    y_axis_property: String,
    y_axis_enums: Array
  },
  methods: {
    get_data_for(x_axis_property, x, y_axis_property, y) {
      const found = this.data.filter((row) => {
        return row[x_axis_property] === x && row[y_axis_property] === y
      })

      return found.length
    },
    handle_click(x_axis_property, x, y_axis_property, y) {
      const data = {[x_axis_property]: x, [y_axis_property]: y}
      this.$emit('click', data)
    }
  }
}
</script>
