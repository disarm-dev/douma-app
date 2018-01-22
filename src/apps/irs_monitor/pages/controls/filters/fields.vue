<template>
  <div>
    <h4>All fields</h4>

    <div class="filter_fields">
      <md-input-container class="filter_field">
        <md-select v-model="filter_name" class="select" :disabled="!field_names.length">
          <md-option v-for="field_name in field_names" :key='field_name' :value="field_name">{{field_name}}</md-option>
        </md-select>

        <md-select v-model="filter_comparator" class="select" disabled>
          <md-option v-for="comparator in comparators" :key="comparator" :value="comparator">{{comparator}}</md-option>
        </md-select>

        <md-select v-model="filter_value" class="select" :disabled="!field_values.length">
          <md-option v-for="value in field_values" :key="value" :value="value">{{value}}</md-option>
        </md-select>
      </md-input-container>

      <md-button :disabled='add_disabled' @click="add_filter()">Add filter</md-button>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {get, sort} from 'lodash'
  import flow from 'lodash/fp/flow'
  import flatten from 'lodash/fp/flatten'
  import uniq from 'lodash/fp/uniq'
  import sortBy from 'lodash/fp/sortBy'
  import map from 'lodash/fp/map'

  const EXCLUDE_FIELD_FILTER = f => !f.startsWith('location')

  export default {
    name: 'field-filters',
    props: ['responses'],
    data() {
      return {
        // see below #reset_inputs for default values
        filter_name: null,
        filter_comparator: null,
        filter_value: null,

        comparators: ['==']
      }
    },
    computed: {
      add_disabled() {
        const can_add = (this.filter_name && this.filter_comparator && this.filter_value)
        return !can_add
      },
      field_names() {
        if (!this.responses || !this.responses.length) return []

        let all_field_names = []
        this.responses.forEach(response => {
          const nested_keys = this.extract_nested_keys(response)
          all_field_names.push(nested_keys)
        })

        const flattened = flow(
          flatten,
          uniq,
          sortBy(x => x)
        )(all_field_names)

        return flattened.filter(EXCLUDE_FIELD_FILTER)
      },
      field_values() {
        if (!this.filter_name) return []

        return flow(
          map(r => {
            return get(r, this.filter_name)
          }),
          uniq,
          sortBy(x => x)
        )(this.responses)
      },
      filter() {
        return {
          name: this.filter_name,
          comparator: this.filter_comparator,
          value: this.filter_value
        }
      }
    },
    created () {
      this.reset_inputs()
    },
    methods: {
      reset_inputs() {
        // TODO: @refac replicating these data definitions === bad
        this.filter_name = ''
        this.filter_comparator = '=='
        this.filter_value = ''
      },
      extract_nested_keys(data) {
        var result = {};

        function recurse(cur, prop) {
          if (Object(cur) !== cur) {
            result[prop] = cur;
          } else if (Array.isArray(cur)) {
            for (var i = 0, l = cur.length; i < l; i++)
              recurse(cur[i], prop + '[' + i + ']');
            if (l === 0)
              result[prop] = [];
          } else {
            var isEmpty = true;
            for (var p in cur) {
              isEmpty = false;
              recurse(cur[p], prop ? prop + '.' + p : p);
            }
            if (isEmpty && prop)
              result[prop] = {};
          }
        }

        recurse(data, '');
        return Object.keys(result);
      },
      add_filter() {
        this.$emit('change', this.filter)
        this.reset_inputs()
      }
    }
  }
</script>

<style scoped>

  .select {
    margin-right: 10px
  }

  .filter_fields {
    display: flex;
    flex-flow: row wrap;
  }

  .filter_field {
    flex: 1 1 33%;
  }
</style>
