<template>
  <div class="applet_container">
    <div v-if="message_type === 'missing_geodata'">
      Missing geodata - required to create fake records.
      <router-link to="/meta/geodata">Click here</router-link> to load it
    </div>

    <md-input-container v-else>
      <label>Number of areas (between 0 and 3 records generated for each area)</label>
      <md-input type="number" v-model="areas_count"></md-input>
      <md-button @click.native="generate_data">Generate</md-button>
    </md-input-container>

    <div v-if="message_type === 'done'">
      Done faking. Created {{created_responses_length}} records.
      <router-link to="/irs/record_point">View records</router-link>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import uuid from 'uuid/v4'
  import random_point_in_polygon from 'random-points-on-polygon'
  import {getCoord} from '@turf/invariant'
  import moment from 'moment-mini'

  import cache from 'config/cache'
  import {get_planning_level_name} from 'lib/instance_data/spatial_hierarchy_helper'
  import {ResponseSchema} from 'lib/models/response/schemas/schema'
  import {get_record_location_selection} from 'lib/instance_data/spatial_hierarchy_helper'
  import {Response} from 'lib/models/response/model'
  import {geodata_in_cache_and_valid} from 'lib/models/geodata/geodata.valid'
  import {hydrate_geodata_cache_from_idb} from 'lib/models/geodata/local.geodata_store'

  export default {
    name: 'fake_responses_debug',
    data() {
      return {
        areas_count: 50,
        message_type: '',
        responses: [],
        created_responses_length: 0
      }
    },
    computed: {
      ...mapState({
        user: state => state.meta.user.username,
        slug: state => state.instance_config.instance.slug,
        personalised_instance_id: state => state.meta.personalised_instance_id,
        instance_config: state => state.instance_config,
      }),
      location_selection() {
        return get_record_location_selection()
      },

      planning_level_name() {
        return get_planning_level_name()
      },
    },
    created () {
      hydrate_geodata_cache_from_idb().then(() => {
        if (!geodata_in_cache_and_valid()) this.message_type = "missing_geodata"
      })
    },
    methods: {
      get_polygon(id) {
        // decorated geodata __disarm_geo_id and __disarm_geo_name
        // get record_location_selection_level_name
        const found = cache.geodata[this.planning_level_name].features.find((feature) => feature.properties.__disarm_geo_id == id)
        if (!found) throw new Error(`Cannot find polygon with __disarm_geo_id of ${id}`)
        return found
      },
      random_number_between(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      random_recorded_on() {
        const period_days = 90
        const max_seconds_ago = period_days * 24 * 60 * 60
        const seconds_ago = this.random_number_between(1, max_seconds_ago)
        return moment().subtract(seconds_ago, 'seconds').toDate()
      },
      select_form_data_type() {
        return this.random_number_between(0, this.instance_config.fake_form.length - 1)
      },
      get_form_data() {
        const fake_form_data = this.instance_config.fake_form
        return fake_form_data[this.select_form_data_type()]
      },
      create_response(location_selection) {
        const location_selection_polygon = this.get_polygon(location_selection.id)
        const point_in_location_selection_polygon = getCoord(random_point_in_polygon(1, location_selection_polygon)[0])

        const response = {
          id: uuid(),
          personalised_instance_id: this.personalised_instance_id,
          instance_slug: this.slug,
          form_data: this.get_form_data(),
          location: {
            coords: {
              accuracy: 100,
              longitude: point_in_location_selection_polygon[0],
              latitude: point_in_location_selection_polygon[1],
            },
            selection: location_selection
          },
          recorded_on: this.random_recorded_on(),
          username: this.user,
          userAgent: navigator.userAgent,
          synced: false,
          team_name: 'Team' + this.random_number_between(1, 5)
        }
        return response
      },
      generate_data() {

        this.location_selection.slice(0, this.areas_count).forEach(location_selection => {
          let count = 0
          const limit = this.random_number_between(1, 3)
          while (count <= limit) {
            const response = this.create_response(location_selection)
            if (ResponseSchema(response)) {
              const decorated_response = new Response(response).decorate_for_sending()
              this.responses.push(decorated_response)
            } else {
              console.log('Fake response failed validation', ResponseSchema.errors(response))
            }
            count += 1
          }
        })

        this.$store.dispatch('irs_record_point/create_responses_local', this.responses)
        this.message_type = 'done'
        this.created_responses_length += this.responses.length
        this.responses = []
      }
    }
  }
</script>

<style lang="css" scoped>

</style>
