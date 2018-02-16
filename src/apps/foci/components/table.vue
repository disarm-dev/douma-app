<template>
  <md-table>
    <md-table-header>
      <md-table-row>
        <md-table-head v-for="column of table_columns" :key="column">{{column}}</md-table-head>
      </md-table-row>
    </md-table-header>

    <md-table-body>
      <md-table-row v-for="row in table_data" :key="row._id" @click.native="click(row)">
        <md-table-cell v-for="column of table_columns" :key="column">{{row[column]}}</md-table-cell>
      </md-table-row>
    </md-table-body>
  </md-table>
</template>
<script>
export default {
  props: ['table_columns', 'table_data'],
  methods: {
    click(row) {
      this.$emit('click', row)
    }
  }
}
</script>

