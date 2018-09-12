import { db } from 'lib/local_db'

export default class Local {
  constructor() {
    this.table = db['instances']
  }

  async read(instance_id) { // the actual id, not nam or bwa
    const instances = await this.table.toArray()
    return instances.find(c => c.id === instance_id)
  }

  async read_all() {
    const instances = await this.table.toArray()
    return instances
  }

  async bulkPut(instances) {
    await this.table.bulkPut(instances)
  }

  async clear() {
    await this.table.clear()
  }
}