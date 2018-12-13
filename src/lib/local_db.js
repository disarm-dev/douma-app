import Dexie from 'dexie'

const db = new Dexie('disarm')
window.__disarm_debug_db = db // TODO: Remove direct DB access?

const fields = {
  v1: {
    responses: 'id, [personalised_instance_id+instance_slug]',
    plan: 'id',
    assignment_plan: 'id',
  }
}

db.version(1).stores({
  // geodata_collection has two columns, called 'disarm_geodata_key' and 'geodata'
  geodata_collection: 'disarm_geodata_key, geodata',

  "monitor/responses": fields.v1.responses,
  "record/responses": fields.v1.responses,

  "monitor/assignment_plan": fields.v1.assignment_plan,
  "tasker/assignment_plan": fields.v1.assignment_plan,

  "monitor/plan": fields.v1.plan,
  "plan/plan": fields.v1.plan,
})

db.version(2).stores({
  "foci/case_clusters": '_id',
  "foci/case_locations": '_id',
})

db.version(3).stores({
  responses: 'id, [personalised_instance_id+instance_id]',
  geodata_collection: 'disarm_geodata_key',
}).upgrade (trans => {
  return trans.responses.toCollection().modify (response => {
    response.instance_id = response.instance_slug
    delete response.instance_slug
    delete response.country
  });
});


async function clean_up_local_dbs() {
  const db_name = 'disarm_geodata'
  if (await Dexie.exists(db_name)) {
    try {
      await Dexie.delete(db_name)
    } catch (e) {
      console.log(`Could not delete ${db_name} db`)
    }
  }
}

export {db, clean_up_local_dbs}


