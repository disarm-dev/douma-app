<template>
  <div>
    <md-input-container>
      <label>Custom location</label>
      <md-input v-model="custom_location_selection"></md-input>
    </md-input-container>

    <span v-if="do_you_mean.length">
        <h4>Do you mean...</h4>
        <md-chip
            class="md-primary"
            v-for="(suggestion, index) in do_you_mean" :key="index"
            md-editable
            @edit="accept_suggestion(suggestion)"
        >
          {{suggestion.name}} ({{suggestion.category}})
        </md-chip>
        <md-chip md-editable class="md-warn" @edit="use_custom">No, use "{{_custom_location_selection}}"</md-chip>
      </span>
  </div>
</template>

<script>
  export default {
    name: 'custom_location',
    props: {
      all_locations: {
        type: Array,
        required: true,
      }
    },
    data() {
      return {
        _custom_location_selection: '',
        do_you_mean: [],
      }
    },
    computed: {
      custom_location_selection: {
        get() {
          return this._custom_location_selection
        },
        set(custom_location) {
          this._custom_location_selection = custom_location
          const matches = this.all_locations.filter(l => l.name.toLowerCase().startsWith(custom_location.toLowerCase())).slice(0, 10)
          this.do_you_mean = custom_location.length ? matches : []
        }
      },
    },
    methods: {
      accept_suggestion(suggestion) {
        this.$emit('custom_use_suggestion', suggestion)
      },
      use_custom() {
        const custom = this._custom_location_selection
        this.do_you_mean = []
        this.$emit('custom_use_custom', custom)
      }
    },
  }
</script>

<style scoped>

</style>