<template>
  <div>
    <div id="map"></div>
    <map_legend
        :entries="entries_for_legend"
        :title="risk_visible ? layer_definitions.normalised_risk.legend_title : plan_layer_definitions.selected_areas.legend_title"
    ></map_legend>

    <md-checkbox :disabled='edit_mode' v-model="risk_visible">Show risk</md-checkbox>
    <md-checkbox v-if="next_level_down" :disabled='show_clusters_disabled' v-model="show_lowest_spatial_level">Show
      {{next_level_down.name}}
    </md-checkbox>
    <div v-if="edit_mode">
      <p>Showing areas where risk is above: {{converted_slider_value}}</p>
      <input id="slider" type="range" ref='risk_slider' :min="slider.min" :max="slider.max" step="slider.step"
             v-model="risk_slider_value">
    </div>
    <div v-if="selected_target_area_ids.length">
      <md-button class="md-raised md-primary" @click="download_plan_geojson">Download plan geojson</md-button>
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import debounce from 'lodash.debounce'
  import is_null from 'lodash.isnull'
  import download from 'downloadjs'
  import moment from 'moment'

  // Map and geospatial
  import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw'

  import bbox from '@turf/bbox'
  import centroid from '@turf/centroid'
  import within from '@turf/within'
  import inside from '@turf/inside'
  import intersect from '@turf/intersect'
  import bboxPolygon from '@turf/bbox-polygon'
  import {featureCollection} from '@turf/helpers'
  import which_polygon from 'which-polygon'
  import numeral from 'numeral'

  import cache from 'config/cache.js'
  import {basic_map} from 'lib/helpers/basic_map'
  import map_legend from 'components/map_legend.vue'
  import {
    get_planning_level_name,
    get_next_level_down_from_planning_level,
    get_next_level_up_from_planning_level
  } from 'lib/instance_data/spatial_hierarchy_helper'
  import {target_areas_inside_focus_filter_area} from '../helpers/target_areas_helper.js'
  import {prepare_palette} from 'lib/helpers/palette_helper.js'
  import {layer_definitions} from 'config/map_layers'
  import plan_layer_definitions from '../helpers/plan_map_layers.js'
  import {LogValueConvertor} from 'lib/helpers/log_helper'

  export default {
    name: 'plan_map',
    props: ['edit_mode', 'selected_filter_area_id'],
    components: {map_legend},
    data() {
      return {
        layer_definitions,
        plan_layer_definitions,
        _risk_scaler: null,

        slider: {
          min: 0,
          max: 100,
          step: 1
        },
        risk_slider_value: 0,
        logslider: null,
        risk_visible: false,

        show_clusters_disabled: true, // No clicking before map_ready
        user_map_focus: false,
        draw: null,
        _map: null,
        map_loaded: false,
        bbox: [],

        handler: {
          click: null,
          move: null
        }
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        areas_included_by_click: state => state.irs_plan.areas_included_by_click,
        areas_excluded_by_click: state => state.irs_plan.areas_excluded_by_click,
        bulk_selected_ids: state => state.irs_plan.bulk_selected_ids,
      }),
      ...mapGetters({
        selected_target_area_ids: 'irs_plan/all_selected_area_ids',
        selected_filter_area: 'irs_plan/selected_filter_area'
      }),
      planning_level_fc() {
        return cache.geodata[get_planning_level_name()]
      },
      next_level_down() {
        return get_next_level_down_from_planning_level()
      },
      next_level_down_fc() {
        return cache.geodata[this.next_level_down.name]
      },
      converted_slider_value() {
        if (!this.logslider) return 0

        let converted_value
        if (parseFloat(this.risk_slider_value) === this.slider.min) {
          converted_value = 0
        } else {
          converted_value = this.logslider(this.risk_slider_value)
        }
        return converted_value
      },
      next_level_down() {
        return get_next_level_down_from_planning_level()
      },
      next_level_up() {
        return get_next_level_up_from_planning_level()
      },
      show_lowest_spatial_level: {
        get() {
          return this.$store.state.irs_plan.show_lowest_spatial_level
        },
        set(value) {
          this.$store.commit('irs_plan/set_show_lowest_spatial_level', value)
        }
      },
      entries_for_legend() {
        if (this.risk_visible) {
          const layer_definition = layer_definitions.normalised_risk
          const palette = prepare_palette(layer_definition)

          return palette.map((array) => {
            const value = this._risk_scaler.value(array[0])
            array[0] = numeral(value).format('0.[00]')

            return {
              text: array[0],
              colour: array[1]
            }
          })
        } else {
          let entries = []
          for (var definition in plan_layer_definitions.selected_areas.items) {
            entries.push(plan_layer_definitions.selected_areas.items[definition])
          }
          return entries
        }

      }
    },
    watch: {
      'show_lowest_spatial_level': 'toggle_cluster_visiblity',
      'edit_mode': 'manage_map_mode',
      'risk_slider_value': 'set_risk_slider_value',

      'risk_visible': 'redraw_target_areas',
      'selected_target_area_ids': 'redraw_target_areas',
      'selected_filter_area_id': 'redraw_target_areas',
    },
    mounted() {
      this.render_map()
    },
    methods: {
      // Get some data in
      render_map() {
        this._map = basic_map(this.$store)

        this._map.on('load', () => {
          this.map_loaded = true
          this.show_clusters_disabled = false
          this.manage_map_mode()
          this.add_target_areas()
          this.fit_bounds()
          this.$emit('map_ready')
          this.set_slider_range()
          this.toggle_cluster_visiblity()
        })
      },

      fit_bounds() {
        this._map.fitBounds(this.bbox, {padding: 20})
      },
      remove_map_listeners() {
        if (this._map) {
          if (this._map.listens('click') && this.handler.click) this._map.off('click', this.handler.click)
          if (this._map.listens('mousemove') && this.handler.move) this._map.off('mousemove', this.handler.move)
        }
      },
      add_map_listeners() {
        this.remove_map_listeners()
        this.handler.click = (e) => {
          const features = this._map.queryRenderedFeatures(e.point, {layers: ['selected', 'unselected', 'bulk_selected', 'bulk_unselected']})
          if (!features) return

          const feature = features[0]

          if (feature) {
            const feature_id = feature.properties.__disarm_geo_id

            const feature_id_in_filter_area_array = target_areas_inside_focus_filter_area({
              area_ids: feature_id,
              selected_filter_area: this.selected_filter_area
            })
            if (feature_id_in_filter_area_array.length) {
              this.$store.commit('irs_plan/toggle_selected_target_area_id', feature_id_in_filter_area_array)
              this.refilter_target_areas()
            }
          }
        }

        this.handler.move = (e) => {
          const features = this._map.queryRenderedFeatures(e.point, {layers: ['selected', 'unselected']})
          if (features)
            this._map.getCanvas().style.cursor = features.length ? 'pointer' : ''
        }

        // Add cursor/pointer handler
        this._map.on('mousemove', this.handler.move)

        // Add click handler
        this._map.on('click', this.handler.click);
      },
      manage_map_mode() {
        // Either show or hide risk when changing map modes
        this.toggle_show_risk()

        // Check if you're in editing mode
        if (this.edit_mode) {
          this.add_map_listeners()
          this.add_draw_controls()
        } else {
          this.remove_map_listeners()
          this.remove_draw_controls()
        }
      },

      // Add and handle target_areas
      add_target_areas() {
        const geojson = this.planning_level_fc
        this.bbox = bbox(geojson)

        if (!this._map.getSource('target_areas_source')) {
          this._map.addSource('target_areas_source', {
            'type': 'geojson',
            'data': geojson
          })
        }

        this._map.addLayer({
          id: 'bulk_selected',
          type: 'fill',
          source: 'target_areas_source',
          paint: {
            'fill-color': plan_layer_definitions.selected_areas.items.bulk_selected.colour,
            'fill-opacity': 0.7,
            'fill-outline-color': 'black'
          },
          filter: ['in', '__disarm_geo_id'].concat(this.bulk_selected_ids)
        }, 'clusters')

        this._map.addLayer({
          id: 'bulk_unselected',
          type: 'fill',
          source: 'target_areas_source',
          paint: {
            'fill-color': plan_layer_definitions.selected_areas.items.bulk_unselected.colour,
            'fill-opacity': 0.5,
            'fill-outline-color': 'black'
          },
          filter: ['!in', '__disarm_geo_id'].concat(this.bulk_selected_ids)
        }, 'clusters')

        this._map.addLayer({
          id: 'selected',
          type: 'fill',
          source: 'target_areas_source',
          paint: {
            'fill-color': plan_layer_definitions.selected_areas.items.selected.colour,
            'fill-opacity': 0.7,
            'fill-outline-color': 'black'
          },
          filter: ['in', '__disarm_geo_id'].concat(this.areas_included_by_click)
        }, 'clusters')

        this._map.addLayer({
          id: 'unselected',
          type: 'fill',
          source: 'target_areas_source',
          paint: {
            'fill-color': plan_layer_definitions.selected_areas.items.unselected.colour,
            'fill-opacity': 0.7,
            'fill-outline-color': 'black'
          },
          filter: ['in', '__disarm_geo_id'].concat(this.areas_excluded_by_click)
        }, 'clusters')

        if (this.selected_filter_area) {
          this._map.addLayer({
            id: 'selected_filter_area',
            type: 'line',
            feature_type: 'fill',
            source: {
              type: 'geojson',
              data: featureCollection([this.selected_filter_area])
            },
            paint: {
              'line-width': 2,
              'line-opacity': 0.7,
              'line-color': plan_layer_definitions.selected_filter_area.colour,
            },
          })

          this.bbox = bbox(this.selected_filter_area)
          this.fit_bounds()
        }

        // Add text labels

        const centroid_features = geojson.features.map((feature) => {
          const c = centroid(feature)
          c.properties = feature.properties
          return c
        })

        this._map.addLayer({
          id: 'area_labels',
          type: 'symbol',
          source: {
            type: 'geojson',
            data: featureCollection(centroid_features)
          },
          layout: {
            'text-field': `{__disarm_geo_name}`,
            'text-size': 14
          },
          paint: {
            'text-color': '#383838',
          }
        })

      },
      remove_target_areas() {
        if (this._map.getLayer('selected'))
          this._map.removeLayer('selected')
        if (this._map.getLayer('unselected'))
          this._map.removeLayer('unselected')
        if (this._map.getLayer('bulk_selected'))
          this._map.removeLayer('bulk_selected')
        if (this._map.getLayer('bulk_unselected'))
          this._map.removeLayer('bulk_unselected')
        if (this._map.getLayer('selected_filter_area'))
          this._map.removeLayer('selected_filter_area')
        if (this._map.getSource('selected_filter_area'))
          this._map.removeSource('selected_filter_area')
        if (this._map.getSource('area_labels'))
          this._map.removeSource('area_labels')
        if (this._map.getLayer('area_labels'))
          this._map.removeLayer('area_labels')

      },
      redraw_target_areas() {
        if (this._map && this.map_loaded) {
          // redraw target areas
          this.remove_target_areas()
          this.add_target_areas()
          this.toggle_show_risk()

          // remove + add draw_controls
          this.add_draw_controls()
        }
      },
      refilter_target_areas() {
        this._map.setFilter('bulk_selected', ['in', '__disarm_geo_id'].concat(this.bulk_selected_ids))
        this._map.setFilter('bulk_unselected', ['!in', '__disarm_geo_id'].concat(this.bulk_selected_ids))
        this._map.setFilter('selected', ['in', '__disarm_geo_id'].concat(this.areas_included_by_click))
        this._map.setFilter('unselected', ['in', '__disarm_geo_id'].concat(this.areas_excluded_by_click))
      },

      // Clusters
      toggle_cluster_visiblity() {
        if (!this.next_level_down) return

        if (!this._map.getSource('clusters_source')) {
          this._map.addSource('clusters_source', {
            type: 'geojson',
            data: this.next_level_down_fc
          })
        }

        if (this.show_lowest_spatial_level) {
          const colour = plan_layer_definitions.lowest_spatial_level.colour


          this._map.addLayer({
            id: 'clusters',
            type: 'fill',
            source: 'clusters_source',
            paint: {
              'fill-color': colour,
              'fill-opacity': 0.9,
              'fill-outline-color': colour
            },
          })
          this.$ga.event('irs_plan', 'change_clusters_visibility', 'visible', true)

        } else {
          if (this._map.getLayer('clusters')) {
            this._map.removeLayer('clusters')
            this.$ga.event('irs_plan', 'change_clusters_visibility', 'visible', false)
          }
        }
      },

      // Draw controls
      add_draw_controls() {
        this.remove_draw_controls()

        if (!this.edit_mode) return

        if (this._map) {
          const options = {
            boxSelect: false,
            keyBindings: false,
            displayControlsDefault: false,
            controls: {
              polygon: true
            }
          }
          this.draw = new MapboxDraw(options)

          this._map.on('draw.create', (e) => {
            this.finish_drawing(e.features)
          })

          this._map.on('draw.modechange', (e) => {
            if (e.mode === 'draw_polygon') this.remove_map_listeners()
          })

          this._map.addControl(this.draw)
        }
      },
      remove_draw_controls() {
        if (this.draw) {
          this._map.removeControl(this.draw)
          this.draw = null
        }
      },
      find_polygons_within_drawn_polygon(polygon_drawn) {

        const all_polygons = this.planning_level_fc

        // calculate centroids for all polygons
        const all_centroids = all_polygons.features.map((feature => {
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
      finish_drawing(features) {
        let polygon_drawn = features[0]

        const polygons_within_polygon_drawn = this.find_polygons_within_drawn_polygon(polygon_drawn)
        const selected_areas = polygons_within_polygon_drawn.features.map(f => f.properties.__disarm_geo_id)

        const selected_areas_in_filter_area = target_areas_inside_focus_filter_area({
          area_ids: selected_areas,
          selected_filter_area: this.selected_filter_area
        })
        this.$store.commit('irs_plan/add_selected_target_areas', selected_areas_in_filter_area)

        this.draw.deleteAll()

        this.add_map_listeners() // Restore original click-handler
        this.refilter_target_areas()
      },

      // Risk slider
      set_risk_slider_value: debounce(function () {
        let areas = this.planning_level_fc.features.filter((feature) => {
          return feature.properties.risk >= this.converted_slider_value
        })

        let area_ids = areas.map((area) => {
          return area.properties.__disarm_geo_id
        })

        const selected_areas_in_filter_area = target_areas_inside_focus_filter_area({
          area_ids,
          selected_filter_area: this.selected_filter_area
        })
        this.$store.commit('irs_plan/set_bulk_selected_ids', selected_areas_in_filter_area)

        this.refilter_target_areas()

        this.$ga.event('irs_plan', 'change_risk_slider')
      }, 750),
      set_slider_range() {
        const values_array = this.planning_level_fc.features.map(area => area.properties.risk).sort()
        const fn = new LogValueConvertor(values_array)
        this.logslider = fn.value
      },

      // RISK
      toggle_show_risk() {
        if (this.risk_visible && !this.edit_mode) {
          this.add_areas_coloured_by_risk()
        } else {
          if (this._map.getLayer('areas_by_risk')) this._map.removeLayer('areas_by_risk')
          if (this._map.getSource('areas_by_risk')) this._map.removeSource('areas_by_risk')
        }
      },
      add_areas_coloured_by_risk() {
        const values_array = this.planning_level_fc.features.map(feature => feature.properties.risk).sort().filter(i => i)

        if (values_array.length === 0) console.error('🚨 Missing all risk values on geodata')

        this._risk_scaler = new LogValueConvertor(values_array)

        const features = this.planning_level_fc.features.map((feature) => {

          if (feature.properties.risk === 0) {
            feature.properties.normalised_risk = 0
          } else if (is_null(feature.properties.risk)) {
            console.log('🚨 null value in risk converted to 0')
            feature.properties.normalised_risk = 0
          } else {
            feature.properties.normalised_risk = this._risk_scaler.lval(feature.properties.risk)
          }
          return feature
        })

        const areas_with_normalised_risk = featureCollection(features)

        // create stops
        const stops = prepare_palette(layer_definitions.normalised_risk)

        this._map.addLayer({
          id: 'areas_by_risk',
          type: 'fill',
          source: {
            type: 'geojson',
            data: areas_with_normalised_risk
          },
          paint: {
            'fill-color': {
              property: 'normalised_risk',
              stops: stops
            },
            'fill-opacity': 0.9,
            'fill-outline-color': 'black'
          }
        }, 'records')
      },

      download_plan_geojson() {
        const area_ids_within_focus_area = target_areas_inside_focus_filter_area({
          area_ids: this.selected_target_area_ids,
          selected_filter_area: this.selected_filter_area
        })

        const features = this.planning_level_fc.features.filter(feature => {
          return area_ids_within_focus_area.includes(feature.properties.__disarm_geo_id)
        })

        const fc = featureCollection(features)
        const date = moment().format('YYYY-MM-DD_HHmm')

        let title
        if (this.selected_filter_area) {
          const selected_filter_area_name = this.selected_filter_area.properties[this.next_level_up.display_field_name]
          title = `${this.instance_config.instance.slug}_${selected_filter_area_name}_irs_plan_${date}.geojson`
        } else {
          title = `${this.instance_config.instance.slug}_irs_plan_${date}.geojson`
        }

        download(JSON.stringify(fc), title)
      }
    }
  }
</script>

<style>
  #map {
    height: 500px;
    z-index: 0;
  }
</style>
