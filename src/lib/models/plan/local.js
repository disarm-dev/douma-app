import {db} from 'lib/local_db'

export default class Local {
  constructor(applet_name) {
    this.table = db[applet_name + '/plan']
  }
}