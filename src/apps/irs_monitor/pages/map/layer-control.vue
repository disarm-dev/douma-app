<template>
  <md-list>
    <md-list-item v-for="layer_string in layer_strings" :key="layer_string" @click="select_layer(layer_string)">
      {{layer_string}}
    </md-list-item>
  </md-list>
</template>

<script>
  export default {
    name: 'layer-control',
    props: ['layer_strings'],
    methods: {
      select_layer(layer_string) {
        this.$emit('select_layer', layer_string)
      }
    }
  }
</script>

<style scoped>

</style>
