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
        <li v-for='instance in local_instances' :key='instance.id' >
          {{instance.name}}
          <ul>
            <li v-for="config in instance.configs" :key="config.id" @click="attempt_launch_with_local_instance(config.id)">
              {{instance.name}}@{{config.version}}
            </li>
          </ul>
        </li>
        <!-- <li v-for='instance in local_instances' :key='instance.id' @click="attempt_launch_with_local_instance(instance)">{{instance.config_id}}@{{instance.config_version}}</li> -->
      </ul>
    </div>
    
    <div>
      <h4>Select remote instance to load config for</h4>
      <ul>
        <li v-for='instance in instances' :key='instance.id' >
          {{instance.name}}
          <ul>
            <li v-for="config in instance.configs" :key="config.id" @click="get_instance_and_attempt_launch(config.id)">
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
        instance_id: state => state.instance.id,
        instance_slug: state => state.instance_config.instance.slug,
        user: state => state.user,
        personalised_instance_id: state => state.personalised_instance_id
      })
    },
    mounted() {
      this.load_published()
      this.get_local_instance_configs()
    },
    methods: {
      async load_published() {
        const user_id = this.user.id
        const res = await InstancesController.published_instances({user_id})
        const instances = res.data
        this.$store.commit('set_instances', instances)
        
        for (const instance of instances) {
          const configs = await InstancesController.published_instance_config({id: instance.id})
          instance.configs = configs
        }

        this.instances = instances
        console.log('instances', instances);
      },
      async get_local_instance_configs() {
        const res = await InstancesController.retrieve_local_configs()
        console.log('local', res);
        this.local_instances = res
      },
      async get_instance_and_attempt_launch(id) {
        const instance_config = await InstancesController.instance_config({id})

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

        await this.check_geodata_and_launch({instance_config: instance_config.lob})       
      },
      attempt_launch_with_local_instance() {
        // find instance_config, 

        return 
        check_geodata_and_launch({instance_config: {}})
      },
      async check_geodata_and_launch({instance_config}) {
        configure_spatial_helpers(instance_config)

        await hydrate_geodata_cache_from_idb(instance_config.instance.slug)

        if (geodata_in_cache_and_valid()) {
          launch({instance_config: instance_config})
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