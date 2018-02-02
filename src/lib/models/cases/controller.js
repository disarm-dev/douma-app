import remote from './remote'
import Local from './local'


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

  // async read_local() {
  //   const case_clusters = await this.local.read_all()
  // }

}