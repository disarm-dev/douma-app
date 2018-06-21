<template>
  <multiselect
    v-model="selected_location"
    :options='suggestion_options'
    :custom-label="custom_label"
    track-by="id"
    @select="set_location_selection"

    :internal-search="false"
    :searchable="true"
    @search-change="suggest"

    :clear-on-select="false"

    :taggable="true"
    @tag="add_tag"
    tag-placeholder="Use this custom entry"
    >
  </multiselect>
</template>

<script>
  import Multiselect from 'vue-multiselect'

  export default {
    name: 'suggest_location',
    components: {Multiselect},
    props: {
      existing_location_selection: {
        type: Object,
        required: false
      },
      all_locations: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        selected_location: null,
        suggestion_options: []
      }
    },
    mounted() {
      // Check if existing_location_selection already
      if (this.existing_location_selection) {
        this.selected_location = this.existing_location_selection
        // Need to emit change event?
      }
    },
    methods: {
      custom_label({name, category}) {
        return name + (category ? ` (${category})` : '')
      },
      suggest(query) {
        // console.log('query', query)
        this.suggestion_options = this.all_locations.filter(l => {
          return l.name
            .toLowerCase()
            .startsWith(query.toLowerCase())
        })
      },
      add_tag(tag) {
        const custom_location = {name: tag}
        this.suggestion_options.push(custom_location)
        this.selected_location = custom_location
      },
      set_location_selection(location_selection) {
        // Could be custom or not - does it matter,
        // as long as it has at least a `name` property?
        console.log('set_location_selection', location_selection)
        // this.suggestion_options = [];
        // this.$emit('set_location_selection', location_selection)
      },
    },
  }
</script>

<style scoped>

</style>