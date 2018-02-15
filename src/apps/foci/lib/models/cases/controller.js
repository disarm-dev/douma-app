import remote from './remote'
import Local from './local'

import {featureCollection, feature} from '@turf/helpers'

export class CasesController {
  constructor(applet_name) {
    this.local = new Local(applet_name)
    this.remote = remote
  }

  async read_all_network() {
    const cases = await this.remote.read_all()

    await this.local.create_or_update_bulk(cases)

    return cases
  }

  convert_cases_to_fc(cases) {
    const array_of_features = cases.map(single_case => {
      const case_feature = feature(single_case.geometry)
      delete single_case.geometry
      case_feature.properties  = single_case
      return case_feature
    })

    return featureCollection(array_of_features)
  }

  async read_local() {
    const cases = await this.local.read_all()
    return cases
  }

  async read_count() {
    const count = this.remote.read_count()
    return count
  }
}