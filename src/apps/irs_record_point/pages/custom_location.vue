<template>
  <div>
    <md-input-container>
      <label>Custom location</label>
      <md-input v-model="custom_location_selection"></md-input>
    </md-input-container>

    <span v-if="do_you_mean.length">
        <h4>Do you mean...</h4>
        <md-chip
            v-for="(suggestion, index) in do_you_mean" :key="index"
            md-editable
            v-on:edit="accept_suggestion(suggestion)"
        >
          {{suggestion.name}} ({{suggestion.category}})
        </md-chip>
        <span>No, use {{custom_location_selection}}</span>
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
          this.do_you_mean = this.all_locations.filter(l => l.name.toLowerCase().startsWith(custom_location.toLowerCase())).slice(0, 10)
        }
      },
    },
    methods: {
      accept_suggestion(suggestion) {
        console.log('use', suggestion)
        // this.$emit('change', suggestion)
        // this.use_custom_location = false;
      }
    },
  }
</script>

<style scoped>

</style>