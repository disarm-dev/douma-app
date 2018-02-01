<template>
  <div>
    I am the detail view. {{foci_id}}
  </div>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex'

  export default {
    name: 'detail',
    props: {
      foci_id: String
    },
    mounted() {
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style scoped>

</style>