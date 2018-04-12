<template>
  <tree-view v-if='response' class='container' :data="response" :options="{maxDepth: 4}"></tree-view>
</template>

<script>
  import {ResponseController} from 'lib/models/response/controller'

  const controller = new ResponseController('record')
  export default {
    name: 'view_response',
    props: {
      response_id: {
        type: String,
        required: true
      }
    },
    mounted() {
      this.find_response(this.response_id)
    },
    methods: {
      async find_response(response_id) {
        const personalised_instance_id = this.$store.state.meta.personalised_instance_id
        const instance = this.$store.state.instance_config.instance.slug

        const responses = await controller.read_all_cache({personalised_instance_id, instance})
        return responses.find(response => response.id === this.response_id)
      },
    }
  }
</script>

<style scoped>

</style>
