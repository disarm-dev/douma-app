import remote from './remote'
import Local from './local'


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

  // async read_local() {
  //   const case_clusters = await this.local.read_all()
  // }

}