import Raven from 'raven-js'

import remote from './remote'
import Local from './local'
import instance_decorator from 'lib/models/response/decorators-evaluated'
import {store} from 'apps/store'
import {guess_location_for} from "lib/models/response/guess_location"

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
    const responses = await this.local.read_all()
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

  async create_local_bulk(responses) {
    return await this.local.create_or_update_bulk(responses)
  }

  async update_local(response) {
    return await this.local.update(response)
  }
}



