<template>
  <div>

    <!-- Already have location set, might want to edit-->
    <template v-if="initial_location_selection">
      <h3>Existing location</h3>
      {{initial_location_selection.name}}
      <span v-if="initial_location_selection.category">({{initial_location_selection.category}})</span>
      <span v-else class="warn">(Custom entry - this record will not appear in the dashboard results)</span>
      <md-button>change</md-button>
    </template>

    <!-- Do not already have location set-->
    <template v-else>
      <h3>* Search for Location</h3>
      <suggest-location
        :all_locations="all_locations"
        :initial_text="initial_text"
        @use_suggestion="use_suggestion"
        @use_custom="use_custom"
      ></suggest-location>
    </template>
  </div>

</template>

<script>
  import SuggestLocation from './suggest_location'
  import {get_record_location_selection} from 'lib/instance_data/spatial_hierarchy_helper'

  //
  // Component emits: `change` with an object which gets sets
  // on `Record.vue` as `this.response.location.selection`.
  // Object is of type {id: string, name: string, category: string}
  // and should be one of the `location_selection` options, or if
  // custom text then just {name: string}
  //
  export default {
    name: 'location_selection_2',
    components: {SuggestLocation},
    props: {
      initial_location_selection: Object,
      default: function() {
        return { name: 'None',}
      }
    },
    data() {
      return {
        all_locations: get_record_location_selection()
      }
    },
    computed: {
      initial_text() {
        if (!this.initial_location_selection) return ''
        return this.initial_location_selection.name
      }
    },
    methods: {
      use_suggestion(suggestion) {
        console.log('suggestion', suggestion)
      },
      use_custom(custom_text) {
        console.log('custom_text', custom_text)
      }
    }
  }
</script>

<style scoped>
  .warn {
    color: orange;
  }
</style>