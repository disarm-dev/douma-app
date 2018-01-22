import uuid from 'uuid/v4'
import which_polygon from 'which-polygon'
import omit from 'lodash.omit'

import {ResponseSchema} from './schemas/schema'
import cache from 'config/cache'
import {get_planning_level_id_field, get_planning_level_name} from 'lib/instance_data/spatial_hierarchy_helper'

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
    team_name: null
  }

  /**
   * Required options: username, instance_slug
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
    return (this.model.form_data !== null) && (this.model.location.coords !== null) && (this.model.location.selection !== null)
  }

  decorate_for_sending() { // TODO: @refac Rename to not conflict with 'decorators'
    if (!this.is_ready_to_send()) return false

    const decorated = omit(this.model, 'synced')
    console.log('🚨 TODO: Update record model use on server and everywhere else (e.g. aggregations and monitor)')
    decorated.country = decorated.instance_slug
    // TODO: @refac Stop adding location_selection to root of response before sending. Don't need it anymore. (https://gitlab.com/disarm/disarm-feedback/issues/47)
    decorated.location_selection = decorated.location.selection

    return decorated
  }

}

