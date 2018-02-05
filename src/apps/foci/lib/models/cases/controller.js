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

    // await this.local.create_or_update_bulk(remote_responses)

    return cases
  }

  convert_cases_to_fc(case_clusters) {
    const array_of_features = case_clusters.map(case_cluster => {
      const case_feature = feature(case_cluster.geometry)
      delete case_cluster.geometry
      case_feature.properties  = case_cluster
      return case_feature
    })

    return featureCollection(array_of_features)
  }

  // async read_local() {
  //   const case_clusters = await this.local.read_all()
  // }

}