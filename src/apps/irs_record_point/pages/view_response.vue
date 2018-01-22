<template>
  <tree-view v-if='response' class='container' :data="response" :options="{maxDepth: 4}"></tree-view>
</template>

<script>

  export default {
    name: 'view_response',
    props: ['response_id'],
    mounted() {
      this.$store.dispatch('irs_record_point/read_records')
    },
    data() {
      return {}
    },
    computed: {
      response() {
        const found = this.$store.state.irs_record_point.responses.find(response => response.id === this.response_id)
        if (found) {
          return found
        }
      }
    },
    methods: {}
  }
</script>

<style scoped>

</style>
