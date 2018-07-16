import { db } from 'lib/local_db'

export default class Local {
  constructor() {
    this.table = db['instance_config']
  }

  async read(config_id) { // also known as instance_slug in this app
    const configs = await this.table.toArray()
    debugger
    return configs.find(c => c.config_id === config_id)
  }

  async read_first() {
    const configs = await this.table.toArray()
    return configs[0]
  }

  async update(instance_config) {
    await this.table.put(instance_config)
  }

  async clear() {
    console.warn('Wiping all instance_configs from table, but think we only ever want to store one?')
    await this.table.clear()
  }
}