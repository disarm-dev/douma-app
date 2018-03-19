import { db } from 'lib/local_db'

export default class Local {
  constructor() {
    this.table = db['instance_config']
  }

  async read(config_id) { // also known as instance_slug in this app
    const configs = await this.table.toArray()
    return configs.find(c => c.config_id === config_id)
  }

  async update(instance_config) {
    await this.table.put(instance_config)
  }
}