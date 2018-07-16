// // CSS
// import './fonts/Roboto.css'
// import './fonts/MaterialIcons.css'
// import 'mapbox-gl/dist/mapbox-gl.css'
// import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
// import 'lib/bootstrap-extract.css' // contains only table-related stuff, but still TODO: remove reliance on bootstrap for monitor-table
// import 'vue-material/dist/vue-material.css'
// import 'vue-multiselect/dist/vue-multiselect.min.css'
// // Imports
// import {configure_error_tracking} from 'config/error_tracking.js'
// import {configure_application} from 'config/configure_application.js'
// import 'config/configure_vue'
// import {configure_pubsub_converters} from 'config/configure_pubsub_converters'
// import {launch_shell_app} from './shell_app'
import {retrieve_local_config} from 'lib/models/instance_config/model'
import {db} from 'lib/local_db'
import InstanceConfigLocal from 'lib/models/instance_config/local'
//
//
// // configure_error_tracking!!
// configure_error_tracking()
//
// // Translate document eventListeners into pubsubcache
// configure_pubsub_converters()

// login, load instance config
(async () => {
  // const local_instance_config = await retrieve_local_config()
  const local_config_db = new InstanceConfigLocal()
  const configs = await local_config_db.read_first()
  debugger

  console.log('local_instance_config', local_instance_config)
  if (local_instance_config) {
    configure_application(instance_config)
  } else {
    launch_shell_app()
  }
})()
