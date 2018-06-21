<template>
  <div>
    <h3>* Set location</h3>

    <multiselect
        v-model="location_selection"
        :options='suggestion_options'
        :custom-label="custom_label"
        track-by="id"
        @select="set_location_selection"
        placeholder="Search for location"

        :internal-search="false"
        :searchable="true"
        @search-change="suggest"
        :options-limit="10"

        :taggable="true"
        @tag="add_tag"
        tag-position="bottom"
        :multiple="true"
        :limit="1"
    >
      <template slot="singleLabel" slot-scope="props">{{props.option.name}}</template>

      <template slot="option" slot-scope="props">
        <span v-if="props.option.name">
          {{props.option.name}} ({{props.option.category}})
        </span>
        <span v-else>
          Use <em>{{props.search}}</em> as a custom entry? Record will not appear on the dashboard.
        </span>
      </template>

      <template
          slot="tag"
          slot-scope="{option, search, remove}"
      >
      <span class="tag" v-if="option.category">
        {{option.name}} ({{option.category}})
      </span>
      <span v-else>
        <span  class="tag warn">
          <em>{{option.name}}</em>
          <md-icon>warning</md-icon>is a custom entry - this record will not appear on the dashboard
        </span>
      </span>
      </template>
    </multiselect>
  </div>

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
        if (query.length < 2) return this.suggestion_options
        this.suggestion_options = this.all_locations.filter(l => {
          return l.name
            .toLowerCase()
            .startsWith(query.toLowerCase())
        })
      },
      add_tag(tag) {
        const custom_location = {name: tag}
        this.location_selection = custom_location
        this.suggestion_options = [custom_location]
        this.set_location_selection(this.location_selection)
      },
      set_location_selection(location_selection) {
        this.$emit('change', location_selection)
      },
    },
  }
</script>

<style scoped>
  .tag {
    position: relative;
    display: inline-block;
    padding: 4px 10px 4px 10px;
    border-radius: 5px;
    margin-right: 10px;
    line-height: 1;
    background-color: #e1e5ff;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
  }

  .warn {
    background: #ffc55b;
  }
</style>