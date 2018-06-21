<template>
  <multiselect
      v-model="location_selection"
      :options='suggestion_options'
      :custom-label="custom_label"
      track-by="id"
      @select="set_location_selection"

      :internal-search="false"
      :searchable="true"
      @search-change="suggest"
      :options-limit="10"

      :taggable="true"
      @tag="add_tag"
      tag-placeholder="Custom location"
      tag-position="bottom"
      :multiple="true"
      :limit="1"
  >
    <!--<template-->
        <!--slot="tag"-->
        <!--slot-scope="{option, search, remove}"-->
    <!--&gt;-->
      <!--{{option.name}} {{option.category ? `${option.category}` : 'warning'}}-->
    <!--</template>-->
  </multiselect>

</template>

<script>
  import Multiselect from 'vue-multiselect'
  import {get_record_location_selection} from 'lib/instance_data/spatial_hierarchy_helper'

  export default {
    name: 'suggest_location',
    components: {Multiselect},
    props: {
      initial_location_selection: {
        type: Object,
        required: false,
      },
    },
    data() {
      return {
        all_locations: get_record_location_selection(),
        location_selection: null,
        suggestion_options: []
      }
    },
    watch: {
      initial_location_selection: function () {
        console.log('this.initial_location_selection changed', this.initial_location_selection)
        this.location_selection = this.initial_location_selection
      }
    },
    methods: {
      custom_label({name, category}) {
        return name + (category ? ` (${category})` : '')
      },
      suggest(query) {
        this.suggestion_options = this.all_locations.filter(l => {
          return l.name
            .toLowerCase()
            .startsWith(query.toLowerCase())
        })
      },
      add_tag(tag) {
        const custom_location = {name: tag}
        // this.suggestion_options.push(custom_location)
        this.location_selection = custom_location
        this.set_location_selection(this.location_selection)
      },
      set_location_selection(location_selection) {
        this.$emit('change', location_selection)
      },
    },
  }
</script>

<style scoped>

</style>