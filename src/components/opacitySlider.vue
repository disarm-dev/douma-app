<template>
  <div class="opacity-slider">
    <span>Opacity</span>
    <input type="range" min="0" max="1.0" step="0.01" v-model="value" />
  </div>
</template>

<script>
export default {
  name: 'OpacitySlider',
  props: ['layer'],
  data () {
    return {
      value: 1
    }
  },
  watch: {
    'value': 'changeOpacity',
    'layer': 'changeOpacity',
  },
  methods: {
    changeOpacity() {
      this.layer.setOpacity(this.value)
    }
  }
};
</script>

<style scoped>
  .opacity-slider {
    background: white;
    padding: 8px;
    border-radius: 5px;

    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
  }
</style>