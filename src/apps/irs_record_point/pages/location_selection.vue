<template>
  <div>
    <md-card-header>
      <div v-if="use_custom_location">Enter location *</div>
      <div v-else>* Select area and sub-area</div>
    </md-card-header>


    <!-- DROPDOWN SELECTION -->
    <div v-if="!is_custom_location || !use_custom_location">
      <multiselect
          class="multiselect"
          v-model="area"
          :options="categories"
          placeholder="Select area"
      >
        <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
      </multiselect>

      <multiselect
          class="multiselect"
          :disabled="!area"
          :options="subarea_options"
          placeholder="Select sub-area"
          track-by="id"
          label="name"

          v-bind:value="location_selection"
          @input="update_value"
      >
        <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
      </multiselect>
    </div>


    <!--CUSTOM LOCATION SELECTION -->
    <!--<div>-->
    <!--<md-checkbox v-model="use_custom_location">Enter custom location (location not on list)</md-checkbox>-->

    <!--<md-input-container v-if="use_custom_location">-->
    <!--<label>Custom location</label>-->
    <!--<md-input v-model="custom_location_selection"></md-input>-->
    <!--</md-input-container>-->

    <!--<md-dialog-confirm-->
    <!--md-title="Are you sure you want to use a custom location?"-->
    <!--md-content="This place name does not fall within the sub-areas provided? If you proceed with a custom name, your data will be saved, but not appear in the dashboard"-->
    <!--md-ok-text="Use custom location"-->
    <!--md-cancel-text="Cancel"-->
    <!--@close="on_close_confirmation"-->
    <!--ref="confirm_custom">-->
    <!--</md-dialog-confirm>-->
    <!--</div>-->

  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import {get, has, uniq} from 'lodash'

  import {get_record_location_selection} from 'lib/instance_data/spatial_hierarchy_helper'
  import cache from 'config/cache'

  export default {
    name: 'location_selection',
    props: {
      location_selection: Object,
    },
    components: {Multiselect},
    data() {
      return {
        _custom_location_selection: '',
        use_custom_location: false,
      }
    },
    computed: {
      is_custom_location() {
        return !has(this.sub_area, 'id')
      },
      area: {
        get() {
          return get(
            this.location_selection,
            'category',
            this.$store.state.irs_record_point.persisted_metadata.area
          )
        },
        set(area_string) {
          this.$store.commit('irs_record_point/set_persisted_metadata', {name: 'area', value: area_string})

          // If the main area changes, must also reset the sub-area/location
          this.reset_location()
        }
      },
      categories() {
        const all_categories = this.all_locations.map(loc => {
          return loc.category
        })

        return uniq(all_categories).sort()
      },

      subarea_options() {
        return this.all_locations
          .filter(l => l.category === this.area)
          .sort((a, b) => a.name.localeCompare(b.name))
      },

      custom_location_selection: {
        get() {
          return this._custom_location_selection
        },
        set(custom_location) {
          this._custom_location_selection = custom_location
          const custom_location_selection = {name: custom_location}
          this.$emit('change', custom_location_selection)
        }
      },
    },
    watch: {
      use_custom_location: 'confirm_use_custom_location'
    },
    created() {
      this.all_locations = get_record_location_selection(cache)
    },
    methods: {
      update_value(selection) {
        this.$emit('change_location_selection', selection)
      },
      reset_location() {
        this.sub_area = null
        this.update_value()
      },

      // Custom location
      confirm_use_custom_location() {
        if (this.use_custom_location) {
          this.$refs.confirm_custom.open();
        } else {
          this.$refs.confirm_custom.close();
        }
      },
      on_close_confirmation(response) {
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
