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

    // Not pure metadata, but we want to persist between each form entry
    persisted_metadata: {},
    guessed_responses:0,
    responses_not_in_village:0
  },
  mutations: {
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
    clear_data_storage: (state) => {
      state.team_name = null
      console.warn('Not clearing irs_record_point.responses - use localStorage.clear() if you really want')
    },
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
    add_responses: (state, responses) => {
      state.responses = state.responses.concat(responses)
    },
    delete_response: (state, response) => {
      let index = state.responses.findIndex((r) => r.id === response.id)
      state.responses.splice(index, 1)
    },
    delete_all_responses: (state) => {
      state.responses = []
    },

    set_persisted_metadata: (state, {name, value}) => {
      const new_metadata = {...state.persisted_metadata, [name]: value}
      state.persisted_metadata = new_metadata
    },
    set_team_name: (state, team_name) => {
      state.persisted_metadata.team_name = team_name
    },
    set_category: (state, category) => {
      state.persisted_metadata.category = category
    }
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
    mark_local_responses_as_synced: async (context, responses) => {
      responses.forEach(response => {
        response.synced = true
      })
      try {
        await controller.create_local_bulk(responses)
        context.commit('update_responses', responses)
      } catch (e) {
        console.error(e)
        context.commit('root:set_snackbar', {message: 'Could not mark records as synced locally'}, {root: true})
      }
    },
    mark_local_responses_as_uneditable: async (context, responses) => {
      responses.forEach(response => {
        response.uneditable = true
      })
      try {
        await controller.create_local_bulk(responses)
        context.commit('update_responses', responses)
      } catch (e) {
        console.error(e)
        context.commit('root:set_snackbar', {message: 'Could not mark records as synced locally'}, {root: true})
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
    create_records: async (context, records) => {
      // TODO: @refac DEFINITELY put batching inside the controller!
      const max_records_in_batch = CONFIG.remote.max_records_batch_size

      // Clone so we can easily splice. response_id ensures updating works
      const records_left = clonedeep(records)

      // Batch creating of records
      const results = {pass: [], fail: []}

      while (records_left.length > 0) {
        const records_batch = records_left.splice(0, max_records_in_batch)

        // TODO: @refac This should be try...catch
        await controller.create_batch_network(records_batch)
          .then((passed_records_ids) => {
            // Find the ids of the  records that were synced, returned either as array of ids or records
            const ids = passed_records_ids.map(record => typeof record === 'string' ? record : record.id);
            const synced_records = ids.map(id => records_batch.find(r => r.id === id))
            context.dispatch('mark_local_responses_as_synced', synced_records)
            results.pass.push(synced_records)
          })
          .catch((failed_records) => {
            context.dispatch('mark_local_responses_as_uneditable', records_batch)
            results.fail.push(records_batch)
          })
      }


      // Return the results array
      return results
    },
    read_records: async (context) => {
      console.log('wrong!'); debugger
      const personalised_instance_id = context.rootState.meta.personalised_instance_id
      const instance = context.rootState.instance_config.instance.slug
      const retrieved_responses = await controller.read_all_cache({personalised_instance_id, instance})
      context.commit('set_responses', retrieved_responses)
    }
  }
}

