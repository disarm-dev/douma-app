import clonedeep from 'lodash.clonedeep'
import Raven from 'raven-js'


import CONFIG from 'config/common'
import {ResponseController} from 'lib/models/response/controller'
import {guess_location_for} from "../../lib/models/response/guess_location";

const controller = new ResponseController('record')


export default {
  namespaced: true,
  unpersisted_state_keys: ['responses'],
  state: {
    responses: [],
    guessed_responses:0,
    responses_not_in_village:0,

    // Not pure metadata, but we want to persist between each form entry
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

    // Guessing
    clear_guessed_responses: (state) => {
      state.guessed_responses = 0
    },
    clear_responses_not_inVillage: (state) => {
      state.responses_not_in_village = 0
    },
    add_guessed_responses: (state, responses) => {
      state.guessed_responses += responses
    },
    add_fixes: (state, fixes) => {
      state.responses_not_in_village += fixes
    },

    // Don't want
    set_responses: (state, responses) => {
      state.responses = responses
    },
    create_response: (state, response) => {
      state.responses.push(response)
    },
    update_response: (state, response) => {
      let index = state.responses.findIndex((r) => r.id === response.id)
      state.responses.splice(index, 1, response)
    },
    update_responses: (state, responses) => {
      for (const response of responses) {
        let index = state.responses.findIndex((r) => r.id === response.id)
        state.responses.splice(index, 1, response)
      }
    },

  },
  actions: {
    guess_response_locations: async (context,responses) => {
      let guessed_location_responses = responses
      try {
        guessed_location_responses = guess_location_for(guessed_location_responses)
        await controller.create_local_bulk(guessed_location_responses)
        context.commit('update_responses', guessed_location_responses)
        context.commit('root:set_snackbar', {message: 'Finished guessing locations'}, {root: true})
      } catch (e) {
        Raven.captureException(e)
        console.error(e)
      }
    },
    create_response_local: async (context, response) => {
      try {
        if (Object.keys(response.location.coords).length === 0) Raven.captureException(new Error('Coords is empty'))
        await controller.create_local(response)
        context.commit('create_response', response)
        context.commit('root:set_snackbar', {message: 'Created record'}, {root: true})
      } catch (e) {
        console.error(e)
        context.commit('root:set_snackbar', {message: 'Could not save record locally'}, {root: true})
      }
    },
    update_response_local: async (context, response) => {
      try {
        if (Object.keys(response.location.coords).length === 0) Raven.captureException(new Error('Coords is empty'))
        await controller.update_local(response)
        context.commit('update_response', response)
        context.commit('root:set_snackbar', {message: 'Updated record'}, {root: true})
      } catch (e) {
        console.error(e)
        context.commit('root:set_snackbar', {message: 'Could not update record locally'}, {root: true})
      }
    },
  }
}

