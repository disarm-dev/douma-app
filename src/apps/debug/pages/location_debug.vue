<template>
  <div class='applet_container'>
    <h3>Debug location</h3>
    <md-button class='md-raised md-primary' @click="get_current_position" :disabled='getting_position || !!watching_position'>Get current location</md-button>
    <md-button class="md-raised" :class="{'md-warn': !!watching_position}" @click="toggle_watch">Watch current location</md-button>
    <p>{{location_msg}}</p>

    <h2 v-if="errors.length">Errors</h2>
    <md-list>
      <md-list-item v-for="error in errors" :key="errors.timestamp">
      {{pretty(error)}}
      </md-list-item>
    </md-list>

    <h2 v-if="locations.length">Recorded locations</h2>
    <md-list>
      <md-list-item v-for="location in locations" :key="location.timestamp">
        <md-icon>location_searching</md-icon>
        <span>{{pretty_location(location)}}</span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
  import objectify from 'geoposition-to-object'
  import moment from 'moment-mini'
  import uuid from 'uuid/v4'

  import {clear_watch, get_current_position, watch_current_position} from 'lib/helpers/location_helper'

  export default {
    name: 'location_debug',
    data () {
      return {
        getting_position: false,
        watching_position: false,

        errors: [],
        locations: [],

        positionOptions: {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        },
      }
    },
    computed: {
      location_msg() {
        if (this.getting_position) return "Getting position"
        if (this.watching_position) return "Watching position"
        return "No activity"
      },
    },
    methods: {
      get_current_position() {
        this.getting_position = true

        get_current_position(this.positionOptions)
          .then((position) => {
            this.getting_position = false

            // Add additional properties
            position = this.create_position_object(position, 'get')
            this.add_location(position)
          }).catch(error => {
            const error_object = {
              code: error.code,
              message: error.message
            }
            this.getting_position = false
            this.errors.push(error_object)
          })
      },
      toggle_watch() {
        if (this.watching_position === false) {
          const callback = (position) => {
            position = this.create_position_object(position, 'watch')
            this.add_location(position)
          }
          const errorCallback = (error) => {
            this.watching_position = false
            console.error(error)
          }

          this.watching_position = watch_current_position(this.positionOptions, callback, errorCallback)
        } else {
          clear_watch(this.watching_position)
          this.watching_position = false
        }


      },
      create_position_object(position, type) {
        position.waypoint_id = this.waypoint_id
        position.username = this.$store.state.meta.user.username
        position.id = uuid()
        position.user_agent = navigator.userAgent
        position.type = type

        return position
      },
      add_location(position) {
        this.locations.unshift(position)
      },

      // Formatting
      human_time(timestamp) {
        return moment(timestamp).format('kk:mm:ss:SS ddd')
      },
      pretty(thing) {
        return JSON.stringify(thing)
      },
      pretty_location(position) {
        const {type} = position
        const {accuracy, latitude, longitude} = position.coords
        return `${type.toUpperCase()} acc: ${accuracy} lat:${latitude} lng:${longitude}`
      },
    }
  }
</script>
