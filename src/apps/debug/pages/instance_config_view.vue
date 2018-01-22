<template>
  <tree-view class='container' :data="instance_config" :options="{maxDepth: 1}"></tree-view>
</template>

<script>
  export default {
    name: 'instance_config_view',
    computed: {
      instance_config() {
        return this.$store.state.instance_config
      }
    },
    methods: {}
  }
</script>

<style scoped>

</style>
