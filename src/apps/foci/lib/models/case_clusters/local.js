import {db} from 'lib/local_db'

export default class Local {
  constructor(applet_name) {
    this.table = db[applet_name + '/case_clusters']
  }

  async count() {
    return await this.table.count()
  }

  async read_all() {
    return await this.table.toArray()
  }

  async create(case_cluster) {
    await this.table.add(case_cluster)
  }

  async update(case_cluster) {
    await this.table.put(case_cluster)
  }

  async create_or_update_bulk(case_clusters) {
    return await this.table.bulkPut(case_clusters)
  }

  async remove_all() {
    await this.table.clear()
  }
}