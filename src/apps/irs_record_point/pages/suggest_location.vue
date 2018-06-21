<template>
  <div>
    <md-input-container>
      <label>Custom location</label>
      <md-input v-model="custom_text"></md-input>
    </md-input-container>

    <span v-if="suggestions.length">
      <h4>Do you mean...</h4>
      <md-chip
          class="md-primary"
          v-for="(suggestion, index) in suggestions" :key="index"
          md-editable
          @edit="accept_suggestion(suggestion)"
      >
          {{suggestion.name}} ({{suggestion.category}})
        </md-chip>
    </span>
    <span v-if="custom_text && editing">
      <md-chip md-editable class="md-warn" @edit="use_custom">Use "{{custom_text}}"</md-chip>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'suggest_location',
    props: {
      initial_text: {
        type: String
      },
      all_locations: {
        type: Array,
        required: true,
      }
    },
    data() {
      return {
        custom_text: '',
        editing: false,
        suggestions: [],
      }
    },
    watch: {
      custom_text: 'suggest'
    },
    mounted() {
      if (this.initial_text) {
        this.custom_text = this.initial_text
        this.$nextTick(() => this.editing = false)
      }
    },
    methods: {
      suggest() {
        this.editing = true
        const matches = this.all_locations.filter(l => {
          return l.name
            .toLowerCase()
            .startsWith(this.custom_text.toLowerCase())
        }).slice(0, 10)

        this.suggestions = this.custom_text.length ? matches : []
      },
      accept_suggestion(suggestion) {
        this.$emit('custom_use_suggestion', suggestion)
      },
      use_custom() {
        const custom = this.custom_text
        this.suggestions = []
        this.editing = false
        this.$emit('custom_use_custom', custom)
      }
    },
  }
</script>

<style scoped>

</style>