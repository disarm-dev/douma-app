<template>
  <div class="spatial-container">
    <span v-if="area_filter_set">Spatial filter already set. Please remove the spatial filter before adding a new one.</span>

    <multiselect
            class="multiselect"
            :disabled="area_filter_set"
            v-model="area"
            :options="categories"
            placeholder="Select area"
            :max-height="200"
    >
      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>

    <multiselect
            class="multiselect"
            :disabled="!area || area_filter_set"
            v-model="sub_area"
            :options="location_options"
            placeholder="Select sub-area"
            track-by="name"
            label="name"
            :max-height="200"
    >
      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>

    <md-button @click="add_filter" :disabled="!area || area_filter_set">Add filter</md-button>

  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import {get_record_location_selection} from 'lib/instance_data/spatial_hierarchy_helper'
  import uniq from 'lodash.uniq'

  export default {
    name: 'spatial_filter',
    components: {Multiselect},
    props: ['filters'],
    data() {
      return {
        _all_locations: [],
        _custom_location_selection: '',
        _sub_area: null,

        area: null,
        sub_area: null
      }
    },
    computed: {
      categories() {
        const all_categories = this._all_locations.map(loc => loc.category)
        return uniq(all_categories).sort()
      },
      location_options() {
        const filtered_sub_areas = this._all_locations.filter(l =>  l.category === this.area)

        return filtered_sub_areas.sort((a, b) => a.name.localeCompare(b.name))
      },


      area_filter_set() {
        return this.filters.some(f => f.name.includes('location.selection.category') || f.name.includes('location.selection.id'))
      }
    },
    created() {
      this._all_locations = get_record_location_selection()
    },
    methods: {
      add_filter() {
        if (this.sub_area) {
          this.add_area()
        } else {
          this.add_category()
        }
      },
      add_category() {
        const filter = {name: 'location.selection.category', comparator: 'equals', value: this.area}
        this.$store.commit('irs_monitor/add_filter', filter)
      },

      add_area() {
        const filter = {name: 'location.selection.id', comparator: 'equals', value: this.sub_area.id, display_value: this.sub_area.name}
        this.$store.commit('irs_monitor/add_filter', filter)
      }
    }
  }
</script>
<style scoped>
  .multiselect {
    margin-top: 0.5em;
  }

  .spatial-container {
    min-height: 290px;
  }
</style>
