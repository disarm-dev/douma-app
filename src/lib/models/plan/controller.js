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

  async read_plan_detail_network(plan_id) {
    console.log('Plan id controler',plan_id)
    return await this.remote.read_plan_detail(plan_id)
  }

  async read_plan_list_network() {
    return await this.remote.read_plan_list()
  }

  async create_plan(plan){
    return await this.remote.create_plan(plan)
  }

  async read_plans() {
    return await this.remote.read_plans()
  }

  async delete_plan(plan){
    return await this.remote.delete_plan(plan)
  }

  async update_plan({plan,_id}){
    return await this.remote.update_plan({plan,_id})
  }
}


