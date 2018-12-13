<template>
  <div>
    <md-toolbar>
      <span class="md-title">Testing and debug tools</span>
    </md-toolbar>

    <div class="container">
      <md-list>

        <!--DATA-->
        <md-list-item>
          <router-link to="/debug/fake_data">
            <md-icon>flight_takeoff</md-icon>
            <span>Create fake data</span></router-link>
        </md-list-item>
        <md-divider class="md-inset"></md-divider>

        <!--NETWORK-->
        <md-list-item @click="check_network">
          <md-icon>settings_ethernet</md-icon>
          <span>Check network</span>
          <md-icon v-if="network_checking" class="md-warn">network_check</md-icon>
          <md-icon v-if='network_pass' class="md-primary">check</md-icon>
        </md-list-item>

        <!--GEODATA VALID-->
        <md-list-item @click="check_geodata_valid">
          <md-icon>data_usage</md-icon>
          <span>Check geodata valid</span>
          <md-icon v-if="geodata_valid">check</md-icon>
        </md-list-item>

        <!--VIEW INSTANCE CONFIG-->
        <md-list-item>
          <router-link :to="{name: 'debug:instance_config_view'}">
            <md-icon>settings_applications</md-icon>
            <span>View instance_config</span></router-link>
        </md-list-item>

        <!-- GEOLOCATION -->
        <md-list-item>
          <md-icon>explore</md-icon>
          <span>Geolocation</span>
          <md-list-expand>
            <md-list-item>
              <router-link to="/debug/location">
                <md-icon>my_location</md-icon>
                <span>location test</span></router-link>
            </md-list-item>
            <md-list-item @click="check_geolocation()">
              <md-icon>location_searching</md-icon>
              <span>check geolocation</span>
              <md-icon v-if='geolocation_pass' class="md-primary">check</md-icon>
            </md-list-item>
            <md-list-item>
              <router-link to="/debug/building">
                <md-icon>location_city</md-icon>
                <span>building hunter</span></router-link>
            </md-list-item>
          </md-list-expand>
        </md-list-item>

        <!-- CLEARING THINGS-->
        <md-list-item>
          <md-icon>delete</md-icon>
          <span>Clear data</span>

          <md-list-expand>
            <md-list-item @click="clear_geodata">
              <md-icon>language</md-icon>
              <span>clear geodata</span>
              <md-icon v-if='geodata_cleared' class="md-primary">check</md-icon>
            </md-list-item>
            <md-list-item v-for="applet in applets" :key="applet" @click="clear_applet_storage(applet)">
              <md-icon>delete</md-icon>
              <span>clear storage for {{applet}}</span>
            </md-list-item>
            <md-list-item @click="clear_local_storage">
              <md-icon class="md-warn">delete_forever</md-icon>
              <span>clear local storage (wipes all records, data, etc)</span></md-list-item>
          </md-list-expand>
        </md-list-item>

      </md-list>

      <md-divider class="md-inset"></md-divider>

      Other pages



    </div>
  </div>
</template>

<script>
  import {get} from 'lodash'

  import {try_reconnect} from 'lib/remote/util'
  import cache from 'config/cache.js'
  import {geodata_in_cache_and_valid} from 'lib/models/geodata/geodata.valid'

  export default {
    name: 'debug',
    data() {
      return {
        // Statuses are 'NONE', 'CHECKING', 'PASS', 'FAIL'
        geolocation_pass: false,

        network_checking: false,
        network_pass: false,

        geodata_valid: false,

        geodata_cleared: false,

        update_status: 'NONE',
      }
    },
    computed: {
      applets() {
        return get(this.$store.state.meta, 'user.allowed_apps.read', [])
      },
    },
    methods: {
      check_geolocation() {
        this.geolocation_pass = 'geolocation' in navigator;
      },
      check_geodata_valid() {
        this.geodata_valid = geodata_in_cache_and_valid()
      },
      clear_local_storage() {
        localStorage.clear()
        console.log('Cleared localStorage')
        this.$router.push('/')
        location.reload()
      },
      clear_applet_storage(applet) {
        console.log('applet', applet)
        const mutation = `${applet}/clear_data_storage`
        this.$store.commit(mutation, {}, {root: true})
      },
      clear_geodata() {
        cache.geodata = {}
        this.geodata_cleared = true
      },
      check_network() {
        this.network_pass = false
        this.network_checking = true
        try_reconnect().then(res => {
          this.network_checking = false
          if (res) this.network_pass = true
        }).catch(() => {
          this.network_pass = false
          this.network_checking = false
        })
      },
      goto_survey_editor() {
        document.location = 'https://dxsurvey.com/'
      }
    }
  }
</script>

<style></style>
