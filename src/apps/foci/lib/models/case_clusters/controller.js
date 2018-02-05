import remote from './remote'
import Local from './local'

import {featureCollection, feature} from '@turf/helpers'


export class CaseClustersController {
  constructor(applet_name) {
    this.local = new Local(applet_name)
    this.remote = remote
  }

  async read_all_network() {
    const case_clusters = await this.remote.read_all()

    // await this.local.create_or_update_bulk(case_clusters)

    return case_clusters
  }

  convert_case_clusters_to_fc(cases) {
    debugger
    const array_of_features = cases.map(single_case => {
      debugger
      const case_cluster_feature = feature(single_case.geometry)
      delete single_case.geometry
      case_cluster_feature.properties  = single_case
      return case_cluster_feature
    })

    return featureCollection(array_of_features)
  }

  // async read_local() {
  //   const case_clusters = await this.local.read_all()
  // }

}