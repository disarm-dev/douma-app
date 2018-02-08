import {db} from 'lib/local_db'

export default class Local {
  constructor(applet_name) {
    this.table = db[applet_name + '/cases']
  }

  async count() {
    return await this.table.count()
  }

  async read_all() {
    return await this.table.toArray()
  }

  async create(single_case) {
    await this.table.add(single_case)
  }

  async update(single_case) {
    await this.table.put(single_case)
  }

  async create_or_update_bulk(cases) {
    return await this.table.bulkPut(cases)
  }

  async remove_all() {
    await this.table.clear()
  }
}