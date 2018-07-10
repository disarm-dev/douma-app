<template>
  <div>
    <md-card-header>
      <div>
        * Select location
        <span v-if="area" class="clear" @click="area = '' && update_value()">Clear</span>
      </div>
    </md-card-header>


    <!-- DROPDOWN SELECTION -->
    <div v-if="!use_custom_location">

      <!--<p>Optionally set an area to filter the dropdown below</p>-->
      <multiselect
          class="multiselect"
          v-model="area"
          :options="categories"
          :placeholder="top_placeholder"
      >
        <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
      </multiselect>

      <!--<p>* Select sub-area from dropdown - if you don't know the area, you can start searching all subareas below</p>-->
      <multiselect
          class="multiselect"
          :options="subarea_options"
          :placeholder="bottom_placeholder"
          track-by="id"
          :custom-label="name_with_category"
          :internal-search="false"
          @search-change="search_subarea"

          v-bind:value="location_selection"
          @input="update_value"
      >
        <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
      </multiselect>
    </div>

    <!--CUSTOM LOCATION SELECTION -->
    <md-checkbox v-model="use_custom_location">Enter custom location (location not on list)</md-checkbox>

    <div v-if="use_custom_location">
      <p class="warning">
        <md-icon class="md-warn">warning</md-icon>
        Enter custom location as text. Data will be saved but will not display in the dashboard
      </p>

      <md-input-container>
        <label>Custom location</label>
        <md-input
            v-bind:value="get(location_selection, 'name', '')"
            @input="update_custom_location"
        ></md-input>
      </md-input-container>
    </div>

    <!-- CUSTOM LOCATION CONFIRMATION DIALOG-->
    <md-dialog-confirm
        md-title="Are you sure you want to use a custom location?"
        md-content="Are you sure this place name does not fall within the areas provided? If you proceed with a custom name, your data will be saved, but not appear in the dashboard"
        md-ok-text="Use custom location"
        md-cancel-text="Cancel"
        @close="on_close_confirmation"
        ref="confirm_custom">
    </md-dialog-confirm>

  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import {get, has, uniq} from 'lodash'

  import {
    get_record_location_selection,
    get_planning_level_name,
    get_next_level_up_from_planning_level
  } from 'lib/instance_data/spatial_hierarchy_helper'

  export default {
    name: 'location_selection',
    props: {
      location_selection: Object,
    },
    components: {Multiselect},
    data() {
      return {
        use_custom_location: false,
        subarea_query: ''
      }
    },
    computed: {
      is_custom_location() {
        return this.location_selection && !has(this.location_selection, 'id')
      },
      area: {
        get() {
          const from_store = this.$store.state.irs_record_point.persisted_metadata.area
          return get(this.location_selection, 'category', from_store)
        },
        set(area_string) {
          this.$store.commit('irs_record_point/set_persisted_metadata', {name: 'area', value: area_string})
          this.update_value() // If the main area changes, reset the location_selection
        }
      },

      // Dropdown options
      categories() {
        return uniq(this.all_locations.map(loc => loc.category)).sort()
      },
      subarea_options() {
        return this.all_locations
          .filter(l => {
            if (!this.area) return true
            return l.category === this.area
          })
          .filter(l => {
            if (!this.subarea_query) return true
            return new RegExp(this.subarea_query, 'i').test(l.name)
          })
          .sort((a, b) => a.name.localeCompare(b.name))
      },
      top_placeholder() {

        return `OPTIONAL: Select to filter ${get_planning_level_name()}`
      },
      bottom_placeholder() {
        return `REQUIRED: Select from ${get_planning_level_name()}`
      }
    },
    watch: {
      location_selection() {
        // The location_selection is only available after mounted, because Record.vue retrieves it async from DB

        // If it's really a custom_location, and UI not already set to use custom_location, then set UI
        // to use custom
        if (this.is_custom_location && !this.use_custom_location) {
          this.use_custom_location = true
        }
      },
      use_custom_location() {
        // When checkbox changes, only show confirmation if it's not a real custom location - avoids the pop when
        // editing an existing custom location
        if (!this.is_custom_location) {
          this.confirm_use_custom_location()
        }

        // If you're setting to false, then reset the location
        if (!this.use_custom_location) {
          this.update_value()
        }
      }
    },
    created() {
      this.all_locations = get_record_location_selection()
    },
    methods: {
      get_planning_level_name,
      get_next_level_up_from_planning_level,
      get,
      singularise(text) {
        return text.replace(/s$/, '')
      },

      search_subarea(query) {
        this.subarea_query = query
      },
      name_with_category({name, category}) {
        if (!this.area) {
          return `${name} (${category})`
        } else {
          return name
        }
      },
      update_value(selection) {
        this.$emit('change_location_selection', selection)
      },

      confirm_use_custom_location() {
        if (this.use_custom_location) {
          this.$refs.confirm_custom.open();
          this.update_value()
        } else {
          this.$refs.confirm_custom.close();
        }
      },
      on_close_confirmation(response) {
        if (response === 'cancel') {
          this.use_custom_location = false
        }
      },
      update_custom_location(text) {
        const custom_location_selection = {name: text}
        this.update_value(custom_location_selection)
      },
    }
  }
</script>
<style>
  .multiselect {
    margin-top: 0.5em;
  }

  .clear {
    color: #ff5723;
    cursor: pointer;
    margin-left: 10px;
  }

  .warning {
    color: #ff5723;
  }
</style>
