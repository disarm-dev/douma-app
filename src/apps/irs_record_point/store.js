import clonedeep from 'lodash.clonedeep'
import Raven from 'raven-js'
import has from 'lodash.has'


import CONFIG from 'config/common'
import {ResponseController} from 'lib/models/response/controller'
import {guess_location_for} from "../../lib/models/response/guess_location";
import moment from 'moment'

const controller = new ResponseController('record')

export default {
  namespaced: true,
  state: {
    // Kind-of metadata we want to persist between each form entry
    persisted_metadata: {},
  },
  mutations: {
    clear_data_storage: (state) => {
      state.team_name = null
      console.warn('Not clearing irs_record_point.responses - use localStorage.clear() if you really want')
    },
    set_persisted_metadata: (state, {name, value}) => {
      const new_metadata = {...state.persisted_metadata, [name]: value}
      state.persisted_metadata = new_metadata
    },
    set_team_name: (state, team_name) => {
      state.persisted_metadata.team_name = team_name
    },
  },
}

