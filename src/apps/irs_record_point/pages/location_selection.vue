<template>
  <div>
    <md-card-header>
      <div v-if="use_custom_location">Enter location *</div>
      <div v-else>* Select area and sub-area</div>
    </md-card-header>

    <multiselect
      class="multiselect"
      v-if="!use_custom_location"
      v-model="area"
      :options="categories"
      placeholder="Select area"
      >
      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>

    <multiselect
      class="multiselect"
      v-if="!use_custom_location"
      :disabled="!area"
      v-model="sub_area"
      :options="location_options"
      placeholder="Select sub-area"
      track-by="id"
      label="name"
      :internal-search="false"
      @search-change="search"
    >
      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>

    <md-checkbox v-model="use_custom_location">Enter custom location (location not on list)</md-checkbox>

    <md-input-container v-if="use_custom_location">
      <label>Custom location</label>
      <md-input v-model="custom_location_selection"></md-input>
    </md-input-container>

  </div>
</template>

<script>
  import Fuse from 'fuse.js'
  import Multiselect from 'vue-multiselect'
  import {get_record_location_selection} from 'lib/instance_data/spatial_hierarchy_helper'
  import { uniq } from 'lodash'

  export default {
    name: 'location_selection',
    props: ['initial_location_selection'],
    components: {Multiselect},
    data() {
      return {
        _fuse: null,
        search_query: '',
        _all_locations: [],
        _custom_location_selection: '',
        use_custom_location: false,

        _sub_area: null
      }
    },
    computed: {
      // primary area selector
      area: {
        get() {
          return this.$store.state.irs_record_point.persisted_metadata.area
        },
        set(area_string) {
          this.$store.commit('irs_record_point/set_persisted_metadata', {name: 'area', value: area_string})
        }
      },
      // secondary area selector
      sub_area: {
        get() {
          return this._sub_area
        },
        set(sub_area_object) {
          this._sub_area = sub_area_object
          this.$emit('change', sub_area_object)
        }
      },

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
      custom_location_selection: {
        get() {
          return this._custom_location_selection
        },
        set(custom_location) {
          this._custom_location_selection = custom_location
          this.$emit('change', { name: custom_location})
        }
      },
    },
    created() {
      this.prepare_fuse()

      if (this.initial_location_selection) {
        this.$emit('change', this.initial_location_selection)

        if (Object.prototype.hasOwnProperty.call(this.initial_location_selection, 'id')) {
          // initial_location_selection is an object for the multiselect
          this.sub_area = this.initial_location_selection
          this.area = this.find_area_for_sub_area(this.sub_area)
        } else {
          // it is a custom text property, use text input
          this.use_custom_location = true
          this.custom_location_selection = this.initial_location_selection.name
        }

      } else {
        this.$emit('change', this.sub_area)
      }
    },
    methods: {
      prepare_fuse() {
        this._all_locations = get_record_location_selection()

        const fuse_options = {
          keys: ['name']
        }

        this._fuse =  new Fuse(this._all_locations, fuse_options)
      },
      find_area_for_sub_area(selection) {
        const found = this._all_locations.find(l => l.id === selection.id)
        if (found) return found.category
      },
      search(query) {
        this.search_query = query
      }
    }
  }
</script>
<style>
  .multiselect {
    margin-top: 0.5em;
  }
</style>
