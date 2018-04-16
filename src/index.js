// CSS
import './fonts/Roboto.css'
import './fonts/MaterialIcons.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'lib/bootstrap-extract.css' // contains only table-related stuff, but still TODO: remove reliance on bootstrap for monitor-table
import 'vue-material/dist/vue-material.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'


// Imports
import {configure_service_worker} from './config/service_worker_client'
import {configure_error_tracking} from 'config/error_tracking.js'
import {launch_shell_application} from 'config/configure_application'

// Configure service_worker
console.warn('DEBUG: serviceWorker disabled')
// configure_service_worker()

// configure_error_tracking!!
configure_error_tracking()

// configure and launch the application
launch_shell_application()
