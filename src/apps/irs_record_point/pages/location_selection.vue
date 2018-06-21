<template>
  <div>

    <!-- Already have location set, might want to edit-->
    <template v-if="location_selection">
      <h3>Existing location</h3>
      {{location_selection.name}}
      <span v-if="location_selection.category">({{location_selection.category}})</span>
      <span v-else class="warn">(Custom entry - this record will not appear in the dashboard results)</span>
      <md-button>change</md-button>
    </template>

    <!-- Do not already have location set-->
    <template v-else>
      <h3>* Search for Location</h3>
      <md-chip v-if="location_selection && !location_selection.category">Warning - setting custom location</md-chip>
      <suggest-location
        :all_locations="all_locations"
        :existing_location_selection="location_selection"
        @set_location_selection="set_location_selection"
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
      location_selection: Object,
      default: function() {
        return { name: 'None',}
      }
    },
    data() {
      return {
        all_locations: get_record_location_selection(),
      }
    },
    computed: {
      initial_text() {
        if (!this.initial_location_selection) return ''
        return this.initial_location_selection.name
      },
    },
    methods: {
      set_location_selection(location_selection) {
        this.location_selection = location_selection
        console.log('set_location_selection', location_selection)
      },
    }
  }
</script>

<style scoped>
  .warn {
    color: orange;
  }
</style>