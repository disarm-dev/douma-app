import remote from './remote'
import Local from './local'

import {featureCollection, feature} from '@turf/helpers'

export class CaseLocationsController {
  constructor(applet_name) {
    this.local = new Local(applet_name)
    this.remote = remote
  }

  async read_all_network() {
    const case_locations = await this.remote.read_all()

    await this.local.create_or_update_bulk(case_locations)

    return case_locations
  }

  convert_case_locations_to_fc(case_locations) {
    const array_of_features = case_locations.map(case_location => {
      const case_feature = feature(case_location.geometry)
      delete case_location.geometry
      case_feature.properties  = case_location
      return case_feature
    })

    return featureCollection(array_of_features)
  }

  async read_local() {
    const case_locations = await this.local.read_all()
    return case_locations
  }

  async read_count() {
    const {count} = await this.remote.read_count()
    return count
  }
}