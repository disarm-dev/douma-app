<template>
  <div class="applet_container">
    <md-card v-if="!buildings_loaded || !selected_building_field">
      <md-card-content>
        <md-input-container>
          <label>Upload GeoJSON</label>
          <md-file :disabled="!map_ready" @selected="upload_buildings"></md-file>
        </md-input-container>

        <md-input-container>
          <label>Field</label>
          <md-select :disabled="buildings_fields_options.length === 0" v-model="selected_building_field">
            <md-option v-for='option in buildings_fields_options' :key='option' :value="option">{{option}}</md-option>
          </md-select>
        </md-input-container>
      </md-card-content>
    </md-card>

    <md-card v-if="buildings_loaded && selected_building_field">
      <md-card-content>
        <p>Clicked on building: {{building_clicked}}</p>
        <md-input-container>
          <label>OSM ID</label>
          <md-input :disabled='!buildings_loaded' v-model="building_typed" placeholder="Will match the LAST few digits."></md-input>
        </md-input-container>
      </md-card-content>
    </md-card>
    <div id="map"></div>

  </div>
</template>

<script>
  import bbox from '@turf/bbox'
  import moment from 'moment-mini'
  import mapboxgl from 'mapbox-gl'

  import {get_current_position} from 'lib/helpers/location_helper.js'
  import {basic_map} from 'lib/helpers/basic_map'

  export default {
    name: 'building_debug',
    data () {
      return {
        // config
        _map: {},
        map_ready: false,
        buildings_loaded: false,
        handler: { click: null },
        _buildings_geojson: null,
        buildings_fields_options: [],
        _user_location_marker: null,

        // user input
        selected_building_field: null,
        building_typed: '',
        building_clicked: '',
        matching_building_ids: []
      }
    },
    watch: {
      'building_typed': 'highlight_building',
      'selected_building_field': 'select_field'
    },
    mounted() {
      this.create_map()
    },
    methods: {
      // Map
      create_map() {
        this._map = basic_map(this.$store)

        // User geolocation
        const geolocate_control = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          watchPosition: true
        })

        geolocate_control.on('error', (e) => {
          console.error('geolocate:error', e)
        })

        geolocate_control.on('geolocate', (e) => {
          const user_coords = [e.coords.longitude, e.coords.latitude]

          if (this._user_location_marker) {
            console.log('existing marker')
            this._user_location_marker.setLngLat(user_coords)
          } else {
            console.log('new marker')
            let el = document.createElement('div')
            el.className = 'user_location'

            this._user_location_marker = new mapboxgl.Marker(el)
              .setLngLat(user_coords)
            this._user_location_marker.addTo(this._map)
          }
        })
        this._map.addControl(geolocate_control)


        // Get map ready to go
        this._map.on('load', () => {
          this.map_ready = true
        })
      },
      add_map_listeners() {
        this._map.on('click',  (e) => {
          const feature = this._map.queryRenderedFeatures(e.point, {layers: ['buildings']})[0]

          if (feature) {
            this.building_clicked = feature.properties[this.selected_building_field]
          }
        })
      },


      // Buildings
      upload_buildings(e) {
        if (e.length === 0) return

        const file = e.item(0)
        const file_reader = new FileReader();

        file_reader.onload = (e) => {
          this._buildings_geojson = JSON.parse(e.target.result)
          this.buildings_fields_options = Object.keys(this._buildings_geojson.features[0].properties)
          this.buildings_loaded = true
        }

        file_reader.readAsText(file)
      },
      select_field() {
        if (this.selected_building_field) this.add_buildings_to_map()
      },

      add_buildings_to_map() {
        if (this._buildings_geojson.length === 0) return

        if (this._map.getLayer('buildings')) {
          this._map.removeLayer('buildings')
        }

        if (this._map.getSource('buildings')) {
          this._map.removeSource('buildings')
        }

        this._map.addLayer({
          id: 'buildings',
          type: 'fill',
          source: {
            type: 'geojson',
            data: this._buildings_geojson
          },
          paint: {
            'fill-color': '#f909bd',
            'fill-opacity': 0.8,
            'fill-outline-color': '#a80088'
          },
          filter: ['!in', this.selected_building_field].concat(this.matching_building_ids)
        })

        this._map.addLayer({
          id: 'highlighted_buildings',
          type: 'fill',
          source: {
            type: 'geojson',
            data: this._buildings_geojson
          },
          paint: {
            'fill-color': '#f9f52e',
            'fill-opacity': 0.8,
            'fill-outline-color': '#ff8d00'
          },
          filter: ['in', this.selected_building_field].concat(this.matching_building_ids)
        })

        const bounds = bbox(this._buildings_geojson)
        this._map.fitBounds(bounds, {padding: 20})
        this.add_map_listeners()
      },
      highlight_building() {
        if (this.building_typed === '') {
          // Stop matching everything with a blank input
          this.matching_building_ids = []
        } else {
          const regex = new RegExp(this.building_typed + "$")
          this.matching_building_ids = this._buildings_geojson.features.filter(building => {
            const id = building.properties[this.selected_building_field]
            return regex.test(id)
          }).map(building => building.properties[this.selected_building_field])
        }

        this._map.setFilter('buildings', ['!in', this.selected_building_field].concat(this.matching_building_ids))
        this._map.setFilter('highlighted_buildings', ['in', this.selected_building_field].concat(this.matching_building_ids))
      },

      // Presentation
      human_time(timestamp) {
        return moment(timestamp).format('kk:mm:ss:SS ddd')
      },
    }
  }
</script>


<style scoped>
  #map {
    height: calc(80vh - 200px);
  }

  .md-card {
    margin: 10px;
  }
</style>

<style>
  .user_location {
    width: 14px;
    height: 14px;
    background-color: #0070ff;
    border-radius: 8px;
  }
</style>
