<template>
  <div class="applet_container">
    <div v-if="message_type === 'missing_geodata'">
      Missing geodata - required to create fake records.
      <router-link to="/meta/geodata">Click here</router-link> to load it
    </div>

    <md-input-container v-else>
      <label>Number of areas (between 0 and 3 records generated for each area)</label>
      <md-input type="number" v-model="areas_count"></md-input>
      <md-button @click.native="go_generate_fake_data">Generate</md-button>
    </md-input-container>

    <div v-if="message_type === 'done'">
      Done faking. Created {{created_responses_length}} records (cumulative).
      <router-link to="/irs/record_point">View records</router-link>
    </div>

    <md-input-container>
      <label>Set batch size (higher than 500 might cause problems)</label>
      <md-input type="number" v-model="batch_size"></md-input>
    </md-input-container>

  </div>
</template>

<script>
  import {geodata_in_cache_and_valid} from 'lib/models/geodata/geodata.valid'
  import {hydrate_geodata_cache_from_idb} from 'lib/models/geodata/local.geodata_store'
  import {ResponseController} from 'lib/models/response/controller'
  import {generate_data} from 'lib/helpers/generate_fake_data'
  const controller = new ResponseController('record')
  import CONFIG from 'config/common'

  export default {
    name: 'fake_responses_debug',
    data() {
      return {
        message_type: '', // ui
        created_responses_length: 0, // ui

        areas_count: 50, // param
      }
    },
    computed: {
      instance_slug() {
        return this.$store.state.instance_config.instance.slug
      },
      planning_level_name() {
        return get_planning_level_name()
      },
      batch_size: {
        get() {
          return CONFIG.remote.max_records_batch_size

        },
        set(val) {
          CONFIG.remote.max_records_batch_size = parseInt(val, 10)
        }
      }
    },
    created () {
      // TODO: hydrate_geodata_cache_from_idb should not be in a vue
      hydrate_geodata_cache_from_idb(this.instance_slug).then(() => {
        if (!geodata_in_cache_and_valid()) this.message_type = "missing_geodata"
      })
    },
    methods: {
      go_generate_fake_data() {
        // TODO: state needed for user, instance, etc. horrible. Refactor Response model to already know this stuff
        const responses = generate_data({state: this.$store.state, areas_count: this.areas_count})
        try {
          controller.create_or_update_bulk_local(responses)
          this.created_responses_length += responses.length
          this.$store.commit('root:set_snackbar', {message: 'Created records'})
        } catch (e) {
          console.error(e) // TODO: Or some better error reporter like Raven
          this.$store.commit('root:set_snackbar', {message: 'Could not save records locally'})
        }

        this.message_type = 'done'
      }
    }

  }
</script>
