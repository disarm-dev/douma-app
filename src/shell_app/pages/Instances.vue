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
  import AuthController from 'shell_app/models/auth/controller'
  import {geodata_required} from 'shell_app/models/geodata/controller'
  import {configure_spatial_helpers} from 'lib/instance_data/spatial_hierarchy_helper'
  import { geodata_in_cache_and_valid } from 'lib/models/geodata/geodata.valid'
  import {launch} from 'shell_app/lib/get_instance_config_permissions_and_launch'
  import {hydrate_geodata_cache_from_idb} from "lib/models/geodata/local.geodata_store";
  import { mapState } from 'vuex';

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
        console.log(instances)
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
        const instance_config = await InstanceConfigsController.instance_config({id})

        this.$store.commit('set_instance_config', instance_config)
        
        const instance = {
          application_version: instance_config.application_version,
          createdAt: instance_config.createdAt,
          id: instance_config.id,
          instance: instance_config.instance,
          updatedAt: instance_config.updatedAt,
          version: instance_config.version,
        }

        this.$store.commit('set_instance', instance)

        await this.check_geodata_and_launch(instance_config)       
      },
      async check_geodata_and_launch(instance_config) {

        // remove permissions for other instances
        const copy_of_user = {...this.$store.state.user} // copy so we don't mutate state, which is bad
        const user = AuthController.prepare_user_for_instance(instance_config.instance_id, copy_of_user)
        const required = geodata_required(user.permissions)

        if (!required) {
          return launch({instance:instance_config.instance_id,instance_config}, user)
        }

        configure_spatial_helpers(instance_config)

        await hydrate_geodata_cache_from_idb(instance_config.instance.slug)
        const valid = geodata_in_cache_and_valid()
        if (valid) {
          launch({instance:instance_config.instance_id,instance_config}, user)
        } else {
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
