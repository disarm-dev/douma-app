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
      @input="update_value"
    >
      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>

    <custom-location
        v-if="use_custom_location"
        :all_locations="_all_locations"
        :initial_custom_text="initial_custom_text"
        @custom_use_suggestion="custom_use_suggestion"
        @custom_use_custom="custom_use_custom"
    ></custom-location>

  </div>
</template>

<script>
  import Fuse from 'fuse.js'
  import Multiselect from 'vue-multiselect'
  import {get_record_location_selection} from 'lib/instance_data/spatial_hierarchy_helper'
  import {has, uniq} from 'lodash'
  import CustomLocation from './suggest_location'

  import cache from 'config/cache'

  //
  // Component emits: `change` with an object which gets sets
  // on `Record.vue` as `this.response.location.selection`.
  // Object is of type {id: string, name: string, category: string}
  // and should be one of the `location_selection` options, or if
  // custom text then just {name: string}
  //

  export default {
    name: 'location_selection',
    props: {
      initial_location_selection: Object,
      required: false,
    },
    components: {Multiselect, CustomLocation},
    data() {
      return {
        _watch_subscription: null,
        _fuse: null,
        search_query: '',
        _all_locations: [],
        use_custom_location: false,
        sub_area: null, // type: {id, name, category}
        initial_custom_text: '',
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
    },
    created() {
      this.prepare_fuse()
      this._watch_subscription = this.$watch('initial_location_selection', this.setup_initial_location_selection)
    },
    methods: {
      setup_initial_location_selection() {
        if (this.initial_location_selection) {
          this._watch_subscription() // call to stop watching the initial_location_selection
          this.$emit('change', this.initial_location_selection)

          if (has(this.initial_location_selection, 'id')) {
            // initial_location_selection is an object for the multiselect
            this.sub_area = this.initial_location_selection
            this.area = this.find_area_for_sub_area(this.sub_area)
          } else {
            // it is a custom text property, use text input
            this.use_custom_location = true
            this.initial_custom_text = this.initial_location_selection.name
          }

        } else {
          this.$emit('change', this.sub_area)
        }
      },
      update_value() {
        this.$emit('change', this.sub_area)
      },
      prepare_fuse() {
        this._all_locations = get_record_location_selection(cache)

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
      },
      custom_use_custom(custom) {
        this.$emit('change', {name: custom})
      },
      custom_use_suggestion(suggestion) {
        this.area = suggestion.category
        this.sub_area = suggestion
        this.use_custom_location = false;
        this.$emit('change', suggestion)
      }
    }
  }
</script>
<style>
  .multiselect {
    margin-top: 0.5em;
  }
</style>
