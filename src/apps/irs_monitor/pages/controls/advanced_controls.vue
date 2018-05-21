<template>
  <div>
    <md-icon class="md-warn">warning</md-icon> Be careful changing these advanced settings, they affect the results displayed on the monitor page.
    <limit_to :responses="responses" :targets="targets"></limit_to>
    <guess_locations :responses="responses"></guess_locations>
  </div>
</template>

<script>
  import limit_to from './limit-to.vue'
  import guess_locations from './guess-locations'

  export default {
    name: 'advanced_controls',
    components: {limit_to, guess_locations},
    props: {
      responses: Array,
      targets: Array
    }
  }
</script>

<style scoped>

</style>