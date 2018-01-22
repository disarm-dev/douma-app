import remote from './remote'
import Local from './local'

export class PlanController {
  constructor(applet_name) {
    this.local = new Local(applet_name)
    this.remote = remote
  }

  async read_plan_current_network() {
    return await this.remote.read_plan_current()
  }

  async create_plan(plan){
    return await this.remote.create_plan(plan)
  }
}


