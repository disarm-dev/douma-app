// CSS
import './fonts/Roboto.css'
import './fonts/MaterialIcons.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'lib/bootstrap-extract.css' // contains only table-related stuff, but still TODO: remove reliance on bootstrap for monitor-table
import 'vue-material/dist/vue-material.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'

// Imports
import 'config/configure_vue'
import {configure_error_tracking} from 'config/error_tracking'
import {launch_shell_app} from './shell_app/launch_shell_app'

(async () => {
  // configure_error_tracking!!
  configure_error_tracking()
  launch_shell_app()
})()
