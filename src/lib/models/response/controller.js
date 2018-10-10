import remote from './remote'
import Local from './local'
import instance_decorator from 'lib/models/response/decorators-evaluated'
import {store} from 'apps/store'
import CONFIG from 'config/common'
import {clonedeep} from 'lodash'
import Raven from 'raven-js'

export class ResponseController {
  constructor(applet_name) {
    this.local = new Local(applet_name)
    this.remote = remote
  }

  async count_local() {
    return await this.local.count()
  }

  async read_new_network_write_local(last_id) {
    const new_responses = await this.remote.read_new(last_id)
    const decorated_responses = instance_decorator(new_responses, store.state.instance_config)
    await this.local.create_or_update_bulk(decorated_responses)
    return decorated_responses
  }

  async read_all_network() {
    // get them from remote
    const remote_responses = await this.remote.read_all()

    // const responses = decorate_responses_from_json(res, context.rootState.instance_config)

    const decorated_responses = instance_decorator(remote_responses, store.state.instance_config)

    // validate and report on errors
    // const valid_responses = validate_responses(remote_responses)

    // decorate as needed (static/by-hand and decorations.json)
    // const decorated_records = decorate_responses(validate_responses)

    // Clear local DB, so data is not stale
    await this.local.remove_all()

    // populate local DB
    await this.local.create_or_update_bulk(decorated_responses)

    // return them
    return remote_responses
  }


  async read_all_cache({personalised_instance_id, instance}) {
    const responses = await this.local.read_all() // TODO: Filter in DB rather than processing all responses?
    return responses.filter(r => {
      return r.instance_slug === instance && r.personalised_instance_id === personalised_instance_id
    })
  }


  async create_batch_network(responses) {
    return await this.remote.create(responses)
  }

  async create_local(response) {
    return await this.local.create(response)
  }

  async create_or_update_bulk_local(responses) {
    return await this.local.create_or_update_bulk(responses)
  }

  async update_local(response) {
    return await this.local.update(response)
  }


  async create_records(responses) {
    const max_records_in_batch = CONFIG.remote.max_records_batch_size

    // Clone so we can easily splice. response_id ensures updating works
    const records_left = clonedeep(responses)

    // Batch creating of responses
    const results = {pass: [], fail: []}

    while (records_left.length > 0) {
      const records_batch = records_left.splice(0, max_records_in_batch)

      // TODO: @refac This should be try...catch
      await this.create_batch_network(records_batch)
        .then(async (passed_response_ids) => {
          // Find the ids of the  responses that were synced, returned either as array of ids or responses
          const ids = passed_response_ids.map(response => typeof response === 'string' ? response : response.id);
          const synced_records = ids.map(id => records_batch.find(r => r.id === id))
          await this.mark_local_responses_as_synced(synced_records)
          results.pass.push(synced_records)
        })
        .catch(async (failed_records) => {
          this.mark_local_responses_as_uneditable(records_batch)
          results.fail.push(records_batch)
        })
    }

    // Return the results array
    return results
  }


  async mark_local_responses_as_synced(responses) {
    responses.forEach(response => {
      response.synced = true
    })
    try {
      await this.create_or_update_bulk_local(responses)
    } catch (e) {
      console.error(e)
    }
  }

  async mark_local_responses_as_uneditable(responses) {
    responses.forEach(response => {
      response.uneditable = true
    })
    try {
      await this.create_or_update_bulk_local(responses)
    } catch (e) {
      console.error(e)
    }
  }

  async create_response_local(response) {
    // update the most recent 'form_completed_at' timestamp
    response.most_recent_form_completed_time = new Date()

    await this.create_local(response)
  }

  async update_response_local(response) {
    // update the most recent 'form_completed_at' timestamp
    response.most_recent_form_completed_time = new Date()

    await this.update_local(response)
  }

  async guess_locations(responses) {

  }

}



