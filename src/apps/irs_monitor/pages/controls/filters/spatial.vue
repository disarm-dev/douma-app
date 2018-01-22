<template>
  <div>
    <h4>Spatial filter</h4>
    <span v-if="area_filter_set">Spatial filter already set. Please remove the spatial filter before adding a new one.</span>

    <multiselect
            class="multiselect"
            :disabled="area_filter_set"
            v-model="area"
            :options="categories"
            placeholder="Select area"
    >
      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>

    <multiselect
            class="multiselect"
            :disabled="!area || area_filter_set"
            v-model="sub_area"
            :options="location_options"
            placeholder="Select sub-area"
            track-by="id"
            label="name"
            :internal-search="false"
            :allow-empty="true"
            @search-change="search"
    >
      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>

    <md-button @click="add_filter" :disabled="!area || area_filter_set">Add filter</md-button>

  </div>
</template>

<script>
  import Fuse from 'fuse.js'
  import Multiselect from 'vue-multiselect'
  import {get_record_location_selection} from 'lib/instance_data/spatial_hierarchy_helper'
  import { uniq } from 'lodash'

  export default {
    name: 'spatial_filter',
    components: {Multiselect},
    props: ['filters'],
    data() {
      return {
        _fuse: null,
        search_query: '',
        _all_locations: [],
        _custom_location_selection: '',

        _sub_area: null,



        area: null,
        sub_area: null
      }
    },
    computed: {
      categories() {
        const all_categories = this._all_locations.map(loc => {
          return loc.category
        })

        return uniq(all_categories).sort()
      },
      location_options() {
        let sub_areas
        if (this.search_query.length) {
          sub_areas = this._fuse.search(this.search_query)
        } else {
          sub_areas = this._all_locations
        }

        const filtered_sub_areas = sub_areas.filter(({category}) =>  category === this.area)

        const sorted_sub_areas = filtered_sub_areas.sort((a, b) => {
          return a.name < b.name ? -1 : a.name > b.name ? 1 : a.name >= b.name ? 0 : NaN;
        })

        return sorted_sub_areas
      },


      area_filter_set() {
        return this.filters.some(f => f.name.includes('location.selection.category') || f.name.includes('location.selection.id'))
      }
    },
    created() {
      this.prepare_fuse()
    },
    methods: {
      prepare_fuse() {
        this._all_locations = get_record_location_selection()

        const fuse_options = {
          keys: ['name']
        }

        this._fuse =  new Fuse(this._all_locations, fuse_options)
      },
      search(query) {
        this.search_query = query
      },

      add_filter() {
        if (this.sub_area) {
          this.add_area()
        } else {
          this.add_category()
        }
      },
      add_category() {
        this.$emit('change', {name: 'location.selection.category', comparator: '==', value: this.area})
      },

      add_area() {
        const filter = {name: 'location.selection.id', comparator: '==', value: this.sub_area.id, display_value: this.sub_area.name}
        this.$emit('change', filter)
      }
    }
  }
</script>
<style>
  .multiselect {
    margin-top: 0.5em;
  }
</style>
