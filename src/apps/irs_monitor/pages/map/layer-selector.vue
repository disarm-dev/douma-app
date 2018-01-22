<template>
  <multiselect
      :options="layer_options"
      track-by="id"
      label="label"
      @input="set_selected_layer"
      :value="selected_layer_id"
  >
  </multiselect>
</template>

<script>
  import Multiselect from 'vue-multiselect'

  const FIXED_OPTIONS = [
    {id: 'none', label: 'No layer'},
    {id: 'normalised_risk', label: 'Risk'}
  ]

  export default {
    name: 'layer-selector',
    components: {Multiselect},
    props: ['aggregation_names', 'selected_layer'],
    data() {
      return {}
    },
    computed: {
      layer_options() {
        return FIXED_OPTIONS.concat(this.aggregation_names.map(name => {
          return {id: name, label: name}
        }))
      },
      selected_layer_id() {
        return this.layer_options.find(o => o.id === this.selected_layer)
      }
    },
    methods: {
      set_selected_layer(option) {
        if (!option) return
        this.$emit('change', option.id)
      }
    }
  }
</script>

<style scoped>

</style>