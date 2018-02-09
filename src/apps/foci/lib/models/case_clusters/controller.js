import { validate_case_clusters } from '../../validate_case_clusters'
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

    validate_case_clusters(case_clusters)

    await this.local.create_or_update_bulk(case_clusters)

    return case_clusters
  }

  convert_case_clusters_to_fc(case_clusters) {
    const array_of_features = case_clusters.map(case_cluster => {
      const case_cluster_feature = feature(case_cluster.geometry)
      delete case_cluster.geometry
      case_cluster_feature.properties  = case_cluster
      return case_cluster_feature
    })

    return featureCollection(array_of_features)
  }

  async read_local() {
    const case_clusters = await this.local.read_all()
    return case_clusters
  }

  async update_case_cluster(case_cluster) {
    validate_case_clusters([case_cluster])
    const updated_cluster = await remote.update(case_cluster)
    this.local.update(updated_cluster)
    return case_cluster
  }
}