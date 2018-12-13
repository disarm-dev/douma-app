export default {
  api: {
    version: 'v8',
    dev_url: 'http://localhost:3000',
    query_parameter: 'api-url',
    default_url: 'https://demo-editor-server.herokuapp.com/v8',
  },
  applets: {
    // The order here is irrelevant to sidebar - that is currently fixed by the user auth/permissions sheet,
    // but should set by instance_config.json
    'irs_record_point': { title: 'IRS Record', icon: 'assignment', geodata_required: false },
    'irs_plan': { title: 'IRS Plan', icon: 'assignment_turned_in', geodata_required: true },
    'irs_monitor': {
      title: 'IRS Monitor',
      icon: 'dashboard',
      geodata_required: true,
      replace_null_key_with: 'unknown',
      defaults: { temporal_aggregation_level: 'week' },
      limit_to_options: ['all', 'responses', 'plan'],
      chart_layout_defaults: { // plotlyjs
        legend: { "x": 1, y: 0, bgcolor: 'rgba(234, 234, 234, 0.79)' }
      }
    },
    'irs_tasker': { title: 'IRS Tasker', icon: 'group', geodata_required: true },
    'debug': { title: 'Debug', icon: 'bug_report', geodata_required: true },
    // Meta below is currently ignored in sidebar (statically included), but here for the breadcrumbs
    'meta': {
      title: 'User',
      icon: 'person',
      geodata_required: false
    },
    'foci': {
      title: 'Foci',
      icon: 'bubble_chart',
      geodata_required: false
    },
    record2: {
      title: 'Record2',
      icon: 'assignment',
      geodata_required: false,
    },
    'bod-client': {
      title: 'BOD Client',
      icon: 'battery_charging_full',
      geodata_required: false
    }
  },
  hash_params: {
    INSTANCE_ID: 'instance',
    API_URL: 'api_url'
  },
  temporal_intervals: ['week', 'month', 'quarter', 'year'],
  basemap: {
    // Middle of southern Africa, start point for zooming in
    default: {
      style: 'mapbox://styles/mapbox/streets-v9',
      coords: [22.63977015806131, -25.276453102086563],
      zoom: 4
    },
    map_token: 'pk.eyJ1Ijoibmljb2xhaWRhdmllcyIsImEiOiJjaXlhNWw1NnkwMDJoMndwMXlsaGo5NGJoIn0.T1wTBzV42MZ1O-2dy8SpOw'
  },
  instances: {
    list: ['test', 'foci', 'struc_demo', 'make', 'bwa', 'nam', 'swz', 'zwe-mats', 'zwe-matn', 'rsa', 'mwi-schisto', 'moz-gbm'],
  },
  remote: {
    max_records_batch_size: 100
  },
}
