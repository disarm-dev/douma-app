<template>
  <div>

    <!-- Already have location set, might want to edit-->
    <template v-if="initial_location_selection">
      <h3>Existing location</h3>
      {{initial_location_selection.name}}
      <span v-if="initial_location_selection.category">({{initial_location_selection.category}})</span>
      <span v-else class="warn">(Custom entry - this record will not appear in the dashboard results)</span>
      <md-button>change</md-button>
    </template>

    <!-- Do not already have location set-->
    <template v-else>
      <h3>* Search for Location</h3>
    </template>
  </div>

</template>

<script>
  //
  // Component emits: `change` with an object which gets sets
  // on `Record.vue` as `this.response.location.selection`.
  // Object is of type {id: string, name: string, category: string}
  // and should be one of the `location_selection` options, or if
  // custom text then just {name: string}
  //
  export default {
    name: 'location_selection2.vue',
    props: {
      initial_location_selection: Object,
      required: false,
    },
  }
</script>

<style scoped>
  .warn {
    color: orange;
  }
</style>