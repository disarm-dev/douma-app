// CSS
import './fonts/Roboto.css'
import './fonts/MaterialIcons.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'lib/bootstrap-extract.css' // contains only table-related stuff, but still TODO: remove reliance on bootstrap for monitor-table
import 'vue-material/dist/vue-material.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'


// Imports
import {configure_error_tracking} from 'config/error_tracking.js'
import {get_instance_config} from 'config/load_instance_config.js'
import {configure_application} from 'config/configure_application.js'
import {configure_pubsub_converters} from 'config/configure_pubsub_converters'

// configure_error_tracking!!
configure_error_tracking()

configure_pubsub_converters()

get_instance_config()
  .then(instance_config => {
    if (instance_config) {
      configure_application(instance_config)
    } else {
      console.error("DEBUG: Screetching stop. No instance_config")
    }
  })
