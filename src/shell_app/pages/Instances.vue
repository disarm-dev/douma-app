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
        <li v-for='instance in local_instances' :key='instance.id' v-if="instance.configs.length">
          {{instance.name}}
          <ul>
            <li v-for="config in instance.configs" :key="config.id" @click="check_geodata_and_launch(config)">
              {{instance.name}}@{{config.version}}
            </li>
          </ul>
        </li>
      </ul>
    </div>
    
    <div>
      <h4>Select remote instance to load config for</h4>
      <ul>
        <li v-for='instance in instances' :key='instance.id' >
          {{instance.name}}
          <ul>
            <li v-for="config in instance.configs" :key="config.id" @click="get_instance_and_attempt_launch(config._id)">
              {{instance.name}}@{{config.version}}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import InstancesController from 'shell_app/models/instances/controller'
  import InstanceConfigsController from 'shell_app/models/instance_configs/controller'
  import { mapState } from 'vuex';
  import {launch_from_instance_id} from 'shell_app/lib/check_geodata_and_launch'

  export default {
    name: 'instances',
    data() {
      return {
        local_instances: [],
        instances: []
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        instance_id: state => state.instance._id,
        instance_slug: state => state.instance_config.instance.slug,
        user: state => state.user,
        personalised_instance_id: state => state.personalised_instance_id
      })
    },
    mounted() {
      this.load_published()
      this.load_local()
    },
    methods: {
      async load_published() {
        const user_id = this.user.id
        const instances = await InstancesController.published_instances({user_id})
        this.$store.commit('set_instances', instances)
        
        for (const instance of instances) {
          instance.configs = await InstanceConfigsController.published_instance_config({id: instance._id})
        }

        this.instances = instances
      },
      async load_local() {
        const local_instances = await InstancesController.retrieve_local_instances()
        const local_configs = await InstanceConfigsController.retrieve_local_configs()

        for (const instance of local_instances) {
          instance.configs = local_configs.filter(config => config.instance === instance.id)
        }
        this.local_instances = local_instances
      },
      async get_instance_and_attempt_launch(id) {
        const can_launch = launch_from_instance_id(id, this.$store)
        if (!can_launch) {
          this.$router.push('/geodata')
        }
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
