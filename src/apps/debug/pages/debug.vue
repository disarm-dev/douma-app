<template>
  <div>

    <div class="container">
      <md-list>

        <md-toolbar md-theme="white">
          <span class="md-title">Check stuff</span>
        </md-toolbar>

        <!--NETWORK-->
        <md-list-item @click="check_network">
          <md-icon>settings_ethernet</md-icon>
          <span>Check network</span>
          <md-icon v-if="network_pass === false" class="md-warn">signal_wifi_off</md-icon>
          <md-icon v-if='network_pass' class="md-primary">check</md-icon>
        </md-list-item>

        <!--GEODATA VALID-->
        <md-list-item @click="check_geodata_valid">
          <md-icon>data_usage</md-icon>
          <span>Check geodata valid</span>
          <md-icon v-if="geodata_valid" class="md-primary">check</md-icon>
        </md-list-item>

        <!-- GEOLOCATION AVAILABLE-->
        <md-list-item @click="check_geolocation()">
          <md-icon>location_searching</md-icon>
          <span>Check geolocation</span>
          <md-icon v-if='geolocation_pass' class="md-primary">check</md-icon>
        </md-list-item>

      </md-list>


      <md-divider class="md-inset"></md-divider>

      <md-toolbar md-theme="white">
        <span class="md-title">Tools</span>
      </md-toolbar>


      <md-list>
        <!--FAKE DATA-->
        <md-list-item>
          <router-link to="/debug/fake_data">
            <md-icon>flight_takeoff</md-icon>
            <span>Create fake data</span></router-link>
        </md-list-item>

        <!--VIEW INSTANCE CONFIG-->
        <md-list-item>
          <router-link :to="{name: 'debug:instance_config_view'}">
            <md-icon>settings_applications</md-icon>
            <span>View instance_config</span></router-link>
        </md-list-item>

        <!-- TEST LOCATION-->
        <md-list-item>
          <router-link to="/debug/location">
            <md-icon>my_location</md-icon>
            <span>location test</span></router-link>
        </md-list-item>

        <!--BUILDING HUNTER-->
        <md-list-item>
          <router-link to="/debug/building">
            <md-icon>location_city</md-icon>
            <span>building hunter</span></router-link>
        </md-list-item>

      </md-list>


    </div>
  </div>
</template>

<script>
  import {try_reconnect} from 'lib/remote/util'
  import {geodata_in_cache_and_valid} from 'lib/models/geodata/geodata.valid'

  export default {
    name: 'debug',
    data() {
      return {
        geolocation_pass: false,
        geodata_valid: false,
        network_pass: null,
      }
    },
    methods: {
      check_geolocation() {
        this.geolocation_pass = 'geolocation' in navigator;
      },
      check_geodata_valid() {
        this.geodata_valid = geodata_in_cache_and_valid()
      },
      check_network() {
        this.network_pass = false
        try_reconnect().then(res => {
          if (res) this.network_pass = true
        }).catch(() => {
          this.network_pass = false
        })
      },
    }
  }
</script>

<style></style>
