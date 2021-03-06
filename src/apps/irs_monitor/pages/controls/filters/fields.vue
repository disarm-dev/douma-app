<template>
  <div class="filter_fields">
    <md-layout>

      <md-layout md-flex-small="33" md-flex-xsmall="100">
        <multiselect
          v-model="filter_name"
          :options="field_names"
          :disabled="!field_name_length"
          placeholder="Field name"
          openDirection="bottom"
          :max-height="200"
        ></multiselect>
      </md-layout>

      <md-layout md-flex-small="33" md-flex-xsmall="100">
        <multiselect
          md-flex-small="33"
          md-flex-xsmall="100"
          v-model="filter_comparator"
          :options="comparators"
          openDirection="bottom"
          :max-height="200"
        ></multiselect>
      </md-layout>

      <md-layout md-flex-small="33" md-flex-xsmall="100">
        <multiselect
          md-flex-small="33"
          md-flex-xsmall="100"
          v-model="filter_value"
          :options="field_values"
          :disabled="!field_name_length"
          placeholder="Value"
          openDirection="bottom"
          :max-height="200"
        ></multiselect>
      </md-layout>

    </md-layout>
    <md-button :disabled='add_disabled' @click="add_filter()">Add filter</md-button>
  </div>
</template>

<script>
  import {get, sort} from 'lodash'
  import flow from 'lodash/fp/flow'
  import uniq from 'lodash/fp/uniq'
  import sortBy from 'lodash/fp/sortBy'
  import filter from 'lodash/fp/filter'
  import map from 'lodash/fp/map'
  import Multiselect from 'vue-multiselect'

  import FieldNamesWorker from '../../../lib/field_names.worker.js'

  export default {
    name: 'field-filters',
    props: ['responses'],
    components: {Multiselect},
    data() {
      return {
        // see below #reset_inputs for default values
        filter_name: null,
        filter_comparator: null,
        filter_value: null,
        comparators: ['equals']
      }
    },
    computed: {
      add_disabled() {
        const can_add = (this.filter_name && this.filter_comparator && this.filter_value)
        return !can_add
      },
      field_name_length() {
        return this.field_names ?
          this.field_names.length :
          0
      },
      field_values() {
        return flow(
          filter(r => {
            return get(r, this.filter_name) !== undefined
          }),
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
      },
      field_dropdown_placeholder() {
        if (this.responses.length === 0) {
          return 'No responses'
        } else if (!this.field_name_length === 0) {
          return 'Getting field names'
        } else {
          return 'Select field'
        }
      }
    },
    asyncComputed: {
      field_names: {
        get() {
          if (!this.responses) return []
          return new Promise((resolve, reject) => {
            this.$nextTick(() => {
              const worker = new FieldNamesWorker()

              worker.postMessage({responses: this.responses})

              worker.addEventListener('message', function (event) {
                resolve(event.data)
              });
            })
          })
        },
        default: []
      },
    },
    created() {
      this.reset_inputs()
    },
    methods: {
      reset_inputs() {
        // TODO: @refac replicating these data definitions === bad
        this.filter_name = ''
        this.filter_comparator = 'equals'
        this.filter_value = ''
      },
      add_filter() {
        this.$store.commit('irs_monitor/add_filter', this.filter)
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
    min-height: 300px;
  }
</style>
