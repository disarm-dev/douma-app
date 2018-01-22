<template>
  <div id="map"></div>
</template>

<script>
  import {mapState} from 'vuex'
  import {featureCollection} from '@turf/helpers'
  import bbox from '@turf/bbox'
  import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw'
  import centroid from '@turf/centroid'
  import within from '@turf/within'
  import intersect from '@turf/intersect'
  import bboxPolygon from '@turf/bbox-polygon'

  import {basic_map} from 'lib/helpers/basic_map.js'
  import cache from 'config/cache'
  import {DECORATED_UNASSIGNED_TEAM} from '../unassigned_team'
  import {planning_level_ids_to_features} from 'lib/models/geodata/polygons_from_geodata'

  export default {
    name: 'tasker-map',
    props: ['plan_target_ids', 'assignments', 'decorated_teams'], // The `cache` is also a source of data in this view
    data() {
      return {
        // Basic map stuff
        _map: null,
        _draw_control: null,
        _click_handler: null,
        _bbox: null,

        // Hard map stuff
        _target_areas_with_assignments_fc: null,
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        map_focus: state => state.instance_config.map_focus
      }),
    },
    watch: {
      'plan_target_ids': 'redraw_assignments',
      'assignments': 'redraw_assignments',
      'decorated_teams': 'redraw_assignments'
    },
    mounted() {
      this.render_map()
    },
    methods: {
      // Basic map stuff
      render_map() {
        // Don't want to create map twice
        if (this._map) return

        this._map = basic_map(this.$store)

        this._map.on('load', () => {
          // Basic map stuff
          this.bind_click_handler()
          this.add_draw_controls()

          // Hard map stuff
          this.redraw_assignments()
          this.fit_bounds()
        })
      },
      fit_bounds() {
        if (this._bbox) this._map.fitBounds(this._bbox, {padding: 20})
      },

      // Click listeners
      bind_click_handler() {
        this._click_handler = (e) => {
          if (!this._map.getLayer('areas')) return

          const clicked_features = this._map.queryRenderedFeatures(e.point, {layers: ['areas']})
          if (!clicked_features) return

          const clicked_feature = clicked_features[0]
          if (!clicked_feature) return
          // Update store
          const area_id = clicked_feature.properties.__disarm_geo_id
          this.$emit('assign_areas_to_selected_team', area_id)

          // Update the map
          this.redraw_assignments()
        }
        this._map.on('click', this._click_handler)
      },
      remove_click_handler() {
        this._map.off('click', this._click_handler)
        this._click_handler = null
      },

      // Draw controls
      add_draw_controls () {
        if (!this._map) return
        this.remove_draw_controls()

        const options = {
          boxSelect: false,
          keyBindings: false,
          displayControlsDefault: false,
          controls: {
            polygon: true
          }
        }
        this._draw_control = new MapboxDraw(options)

        // Remove click handler when you start to draw - avoids selecting first polygon
        this._map.on('draw.modechange', (e) => {
          if(e.mode === 'draw_polygon') this.remove_click_handler()
        })

        // Watch for a new polygon being completed
        this._map.on('draw.create', this.finish_drawing)

        this._map.addControl(this._draw_control)
      },
      remove_draw_controls () {
        if (this._draw_control) {
          this._map.removeControl(this._draw_control)
          this._draw_control = null
        }
      },
      finish_drawing(e) {

        // Find polygons within drawn polygon and assign to selected team
        const drawn_polygon = e.features[0]
        const polygons_within_polygon_drawn = this.find_polygons_within_drawn_polygon(drawn_polygon)
        const area_ids = polygons_within_polygon_drawn.features.map(f => f.properties.__disarm_geo_id)
        this.$emit('assign_areas_to_selected_team', area_ids)

        // Clear your lovely polygon
        this._draw_control.deleteAll()

        // Rebind the original click handler
        this.bind_click_handler()

        // Update the map
        this.redraw_assignments()
      },
      find_polygons_within_drawn_polygon(polygon_drawn) {
        const all_polygons = this._target_areas_with_assignments_fc.features

        // calculate centroids for all polygons
        const all_centroids = all_polygons.map((feature => {
          const c = centroid(feature)
          c.properties = feature.properties
          return c
        }))

        // Create a Bbox from polygon_drawn
        const bounding_box = bbox(polygon_drawn)

        // bounding_box_centroids =  Find all centroids in bbox
        const bounding_box_centroids = within(featureCollection(all_centroids), featureCollection([bboxPolygon(bounding_box)]))

        // find centroids in polygon_drawn
        const centroids_in_polygon_drawn = within(bounding_box_centroids, featureCollection([polygon_drawn]))

        // return ids of centroids in polygon_drawn
        return centroids_in_polygon_drawn
      },

      // Hard map stuff
      redraw_assignments() {
        // Not much point doing anything more, if there are no plan features to work with!
        if (this.plan_target_ids.length === 0) return

        // get the target_area_polygons
        // get the assignments array this.assignments
        // map over target_area_polygons to add assignments to each
        const features = planning_level_ids_to_features(this.plan_target_ids, (feature) => {
          const assignment = this.assignments.find(i => i.area_id === feature.properties.__disarm_geo_id)
          if (assignment) {
            feature.properties.team_name = assignment.team_name
          } else {
            feature.properties.team_name = DECORATED_UNASSIGNED_TEAM.team_name
          }
          return feature
        })


        // Save feature collection
        this._target_areas_with_assignments_fc = featureCollection(features)

        // Remove existing layers
        if (this._map.getLayer('areas')) this._map.removeLayer('areas')
        if (this._map.getSource('areas')) this._map.removeSource('areas')
        if (this._map.getSource('area_labels')) this._map.removeSource('area_labels')
        if (this._map.getLayer('area_labels')) this._map.removeLayer('area_labels')

        // (Re)create palette
        const palette = this.decorated_teams.map(({team_name, colour}) => {
          if (team_name === null) return null
          return [team_name, colour]
        }).filter(i => i)

        // Set bounding box
        this._bbox = bbox(this._target_areas_with_assignments_fc)

        // draw the layer on the map, with pixels. and math. on your screen.
        this._map.addLayer({
          id: 'areas',
          type: 'fill',
          source: {
            type: 'geojson',
            data: this._target_areas_with_assignments_fc
          },
          paint: {
            'fill-color': {
              type: 'categorical',
              property: 'team_name',
              stops: palette,
              default: 'grey'
            },
            'fill-opacity': 0.9,
            'fill-outline-color': '#262626'
          }
        })

        this._map.addLayer({
          id: 'area_labels',
          type: 'symbol',
          source: {
            type: 'geojson',
            data: this._target_areas_with_assignments_fc
          },
          layout: {
            'text-field': `{__disarm_geo_name}`,
          }
        })
      },
    }
  }
</script>

<style scoped>
  #map {
    height: 500px
  }
</style>
