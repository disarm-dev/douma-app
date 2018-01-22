import {db} from 'lib/local_db'

export default class Local {
  constructor(applet_name) {
    this.table = db[applet_name + '/responses']
  }

  async count() {
    return await this.table.count()
  }

  async read_all() {
    return await this.table.toArray()
  }

  async create(response) {
    await this.table.add(response)
  }

  async update(response) {
    await this.table.put(response)
  }

  async create_or_update_bulk(responses) {
    return await this.table.bulkPut(responses)
  }

  async remove_all() {
    await this.table.clear()
  }
}