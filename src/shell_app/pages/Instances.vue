<template>
  <div>
    <h4>Select instance to load config for</h4>
    <ul>
      <li v-for='instance in instances' :key='instance.id' @click="launch_instance(instance.id)">{{instance.name}}</li>
    </ul>
  </div>
</template>

<script>
  import InstancesController from 'shell_app/models/instances/controller'
  import {get_instance_config_permissions_and_launch} from 'shell_app/lib/get_instance_config_permissions_and_launch'

  export default {
    name: 'instances',
    data() {
      return {
        instances: []
      }
    },
    mounted() {
      this.load_published()
    },
    methods: {
      async load_published() {
        const res = await InstancesController.published_instances()
        this.instances = res.data.instances
      },
      async launch_instance(instance_id) {
        await get_instance_config_permissions_and_launch({instance_id})
      }
    }
  }
</script>

<style scoped>

</style>