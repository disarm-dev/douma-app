import uuid from 'uuid/v4'
import omit from 'lodash.omit'

import {ResponseSchema} from './schemas/schema'
import moment from 'moment'

export class Response {
  model;

  defaults = {
    userAgent: navigator.userAgent,
    id: uuid(),
    recorded_on: new Date(),
    location: {
      coords: null,
      selection: null
    },
    form_data: null,
    synced: false,
    team_name: null,
  }

  /**
   * Required options: username, instance_id
   * @param options
   */
  constructor(options) {
    this.model = Object.assign(this.defaults, options)
    this.validate()
  }

  validate() {
    const errors = ResponseSchema.errors(this.model)

    if (errors) {
      throw new Error(`ResponseSchema validation failed: ${JSON.stringify(errors)}`)
    } else {
      return true
    }
  }

  update(options) {
    this.model = Object.assign(this.model, options)
    this.validate()
  }

  is_ready_to_send() {
    return this.model.form_data !== null
  }

  decorate_for_sending() { // TODO: @refac Rename to not conflict with 'decorators'
    console.log('🚨 TODO: Update record model use on server and everywhere else (e.g. aggregations and monitor)')
    if (!this.is_ready_to_send()) return false

    const decorated = omit(this.model, 'synced')

    // TODO: @refac Stop adding location_selection to root of response before sending. Don't need it anymore. (https://gitlab.com/disarm/disarm-feedback/issues/47)
    decorated.location_selection = decorated.location.selection

    // record 'initial form completion duration in seconds' based on timestamps",
    // but only the first time - subsequent times will be edits, and want to ignore
    if (!decorated.hasOwnProperty('initial_form_completion_duration_seconds')) {
      decorated.initial_form_completion_duration_seconds = moment().diff(decorated.recorded_on, 'seconds')
    }

    return decorated
  }

}

