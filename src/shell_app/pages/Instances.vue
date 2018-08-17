<template>
  <div class="container">
    <div>
      <p>
        Hi {{user.name}}, you are logged in as <b>{{user.username}}</b> 
        with personalised_instance_id: <b>{{personalised_instance_id}}</b>
      </p>
    </div>

    <div>
      <md-button @click="logout()">
        Logout
      </md-button>
    </div>

    <div>
      <h4>Select locally saved instance</h4>
      <ul>
        <li v-for='instance in local_instances' :key='instance.id' @click="launch_local_instance(instance)">{{instance.config_id}}@{{instance.config_version}}</li>
      </ul>
    </div>
    
    <div>
      <h4>Select remote instance to load config for</h4>
      <ul>
        <li v-for='instance in instances' :key='instance.id' @click="launch_instance(instance.config_id)">{{instance.config_id}}@{{instance.config_version}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import InstancesController from 'shell_app/models/instances/controller'
  import {get_instance_config_permissions_and_launch, launch_with_local_config} from 'shell_app/lib/get_instance_config_permissions_and_launch'

  export default {
    name: 'instances',
    data() {
      return {
        local_instances: [],
        instances: []
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      },
      personalised_instance_id() {
        return this.$store.state.personalised_instance_id
      }
    },
    mounted() {
      this.load_published()
      this.get_local_instance_configs()
    },
    methods: {
      async load_published() {
        const res = await InstancesController.published_instances()
        this.instances = res.data
      },
      async get_local_instance_configs() {
        const res = await InstancesController.retrieve_local_configs()
        this.local_instances = res
      },
      async launch_instance(instance_id) {
        await get_instance_config_permissions_and_launch({instance_id})
      },
      launch_local_instance(instance_config) {
        launch_with_local_config({instance_config})
      },
      logout() {
        this.$store.commit('set_user', null)
        this.$router.push({name: 'shell:login'})
      }
    }
  }
</script>

<style scoped>
  .container {
    padding: 0.5em;
  }
</style>