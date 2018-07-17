// CSS
import './fonts/Roboto.css'
import './fonts/MaterialIcons.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'lib/bootstrap-extract.css' // contains only table-related stuff, but still TODO: remove reliance on bootstrap for monitor-table
import 'vue-material/dist/vue-material.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'

// Imports
import pubsubcache from 'lib/helpers/pubsubcache'
import 'config/configure_vue'
import {retrieve_local_config} from './shell_app/instance_config/controller'
import {configure_error_tracking} from 'config/error_tracking'
import {configure_pubsub_converters} from 'config/configure_pubsub_converters'
import {launch_main_app} from 'config/launch_main_app'
import {launch_shell_app} from './shell_app'

(async () => {
  // configure_error_tracking!!
  configure_error_tracking()

  // Translate document eventListeners into pubsubcache
  configure_pubsub_converters()

  // listener for launching main app from shell_app
  pubsubcache.subscribe('shell:launch_with_config', (topic, {instance_config, user}) => {
    launch_main_app({instance_config, user})
  })

  // login, load instance config
  const local_instance_config = await retrieve_local_config()

  if (local_instance_config) {
    launch_main_app(local_instance_config)
  } else {
    launch_shell_app()
  }
})()
