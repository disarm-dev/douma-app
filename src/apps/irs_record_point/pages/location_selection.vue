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
      :options="all_locations"
      placeholder="Select sub-area"
      track-by="id"
      label="name"
      @input="update_value"
    >
      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>

    <md-checkbox v-model="use_custom_location">Enter custom location (location not on list)</md-checkbox>

    <md-input-container v-if="use_custom_location">
      <label>Custom location</label>
      <md-input v-model="custom_location_selection"></md-input>
    </md-input-container>

    <md-dialog-confirm
        md-title="Are you sure you want to use a custom location?"
        md-content="This place name does not fall within the sub-areas provided? If you proceed with a custom name, your data will be saved, but not appear in the dashboard"
        md-ok-text="Use custom location"
        md-cancel-text="Cancel"
        @close="onClose"
        ref="confirm_custom">
    </md-dialog-confirm>

  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import {get_record_location_selection} from 'lib/instance_data/spatial_hierarchy_helper'
  import { uniq } from 'lodash'

  import cache from 'config/cache'

  export default {
    name: 'location_selection',
    props: ['initial_location_selection'],
    components: {Multiselect},
    data() {
      return {
        _watch_subscription: null,
        _custom_location_selection: '',
        use_custom_location: false,
        sub_area: null
      }
    },
    computed: {
      area: {
        get() {
          return this.$store.state.irs_record_point.persisted_metadata.area
        },
        set(area_string) {
          this.$store.commit('irs_record_point/set_persisted_metadata', {name: 'area', value: area_string})
        }
      },
      categories() {
        const all_categories = this.all_locations.map(loc => {
          return loc.category
        })

        return uniq(all_categories).sort()
      },
      subarea_options() {

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
    watch: {
      use_custom_location: 'confirm_use_custom_location'
    },
    created() {
      this.all_locations = get_record_location_selection(cache)
      this._watch_subscription = this.$watch('initial_location_selection', this.setup_initial_location_selection)
    },
    methods: {
      setup_initial_location_selection() {
        if (this.initial_location_selection) {
          this._watch_subscription() // call to stop watching the initial_location_selection
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
      update_value() {
        this.$emit('change', this.sub_area)
      },
      find_area_for_sub_area(selection) {
        const found = this.all_locations.find(l => l.id === selection.id)
        if (found) return found.category
      },
      search(query) {
        this.search_query = query
      },
      confirm_use_custom_location() {
        if (this.use_custom_location) {
          this.$refs.confirm_custom.open();
        } else {
          this.$refs.confirm_custom.close();
        }
      },
      onClose(response) {
        if (response === 'cancel') {
          this.use_custom_location = false
        }
      }
    }
  }
</script>
<style>
  .multiselect {
    margin-top: 0.5em;
  }
</style>
