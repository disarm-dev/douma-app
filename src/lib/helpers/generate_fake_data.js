import uuid from 'uuid/v4'
import random_point_in_polygon from 'random-points-on-polygon'
import {getCoord} from '@turf/invariant'
import moment from 'moment-mini'

import cache from 'config/cache'
import {get_planning_level_name} from 'lib/instance_data/spatial_hierarchy_helper'
import {ResponseSchema} from 'lib/models/response/schemas/schema'
import {get_record_location_selection} from 'lib/instance_data/spatial_hierarchy_helper'
import {Response} from 'lib/models/response/model'


function get_polygon(id) {
  const found = cache.geodata[get_planning_level_name()].features.find((feature) => feature.properties.__disarm_geo_id == id)
  if (!found) throw new Error(`Cannot find polygon with __disarm_geo_id of ${id}`)
  return found
}

function random_number_between(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function random_recorded_on() {
  const period_days = 90
  const max_seconds_ago = period_days * 24 * 60 * 60
  const seconds_ago = random_number_between(1, max_seconds_ago)
  return moment().subtract(seconds_ago, 'seconds').toDate()
}

function get_form_data(instance_config) {
  const fake_form_data = instance_config.fake_form
  return fake_form_data[random_number_between(0, instance_config.fake_form.length - 1)]
}

function create_response(state, single_location_selection) {
  const user =  state.meta.user.username
  const instance_id = state.instance_config.instance_id
  const personalised_instance_id = state.meta.personalised_instance_id
  const instance_config = state.instance_config

  const location_selection_polygon = get_polygon(single_location_selection.id)
  const point_in_location_selection_polygon = getCoord(random_point_in_polygon(1, location_selection_polygon)[0])

  const response = {
    id: uuid(),
    personalised_instance_id: personalised_instance_id,
    instance_id,
    form_data: get_form_data(instance_config),
    location: {
      coords: {
        accuracy: 100,
        longitude: point_in_location_selection_polygon[0],
        latitude: point_in_location_selection_polygon[1],
      },
      selection: single_location_selection
    },
    recorded_on: random_recorded_on(),
    username: user,
    userAgent: navigator.userAgent,
    synced: false,
    team_name: 'Team' + random_number_between(1, 5),
  }
  return response
}

export function generate_data({state, areas_count}) {
  // debugger
  let responses = []
  const location_selection_list = get_record_location_selection(cache)

  location_selection_list.slice(0, areas_count).forEach(location => {
    let count = 0
    const limit = random_number_between(1, 3)
    while (count <= limit) {
      const response = create_response(state, location)
      if (ResponseSchema(response)) {
        const decorated_response = new Response(response).decorate_for_sending()
        responses.push(decorated_response)
      } else {
        console.log('Fake response failed validation', ResponseSchema.errors(response))
      }
      count += 1
    }
  })

  return responses
}
