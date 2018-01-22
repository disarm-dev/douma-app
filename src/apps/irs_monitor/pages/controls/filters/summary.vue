<template>
    <div v-if="filters.length">
        <h4>Active filters</h4>
        <md-chip v-for="({name, comparator, value}, index) in formatted_filters" :key="index" md-deletable @delete="on_delete(filters[index])">
            {{name}} {{comparator}} {{value}}
        </md-chip>
    </div>
</template>

<script>
    import {cloneDeep} from 'lodash'
  export default {
    name: 'filter-summary',
    props: ['filters'],
    computed: {
      formatted_filters() {
        const cloned_filters = cloneDeep(this.filters)

        return cloned_filters.map(f => {
          if (f.hasOwnProperty('display_value')) {
            f.value = f.display_value
          }

          if (f.hasOwnProperty('display_name')) {
            f.name = f.display_name
          }

          return f
        })
      }
    },
    methods: {
      on_delete(filter) {
        this.$emit('remove_filter', filter)
      }
    }
  }
</script>

<style scoped>

</style>