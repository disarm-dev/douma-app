import Dexie from 'dexie'

const db = new Dexie('disarm')

const fields = {
  v1: {
    responses: 'id, [personalised_instance_id+instance_slug]',
    plan: 'id',
    assignment_plan: 'id'
  }
}

db.version(1).stores({
  geodata_collection: `disarm_geodata_key, geodata`, // geodata_collection has two columns, called 'disarm_geodata_key' and 'geodata'

  "monitor/responses": fields.v1.responses,
  "record/responses": fields.v1.responses,

  "monitor/assignment_plan": fields.v1.assignment_plan,
  "tasker/assignment_plan": fields.v1.assignment_plan,

  "monitor/plan": fields.v1.plan,
  "plan/plan": fields.v1.plan,
  
})

// db.version(2)
//   .stores({
//     geodata_collection: `disarm_geodata_key, geodata`, // geodata_collection has two columns, called 'disarm_geodata_key' and 'geodata'
//     responses: 'id',
//
//     "monitor/responses": 'id',
//     "monitor/plan": 'id',
//     "monitor/assignment_plan": 'id',
//
//     "record/responses": 'id',
//
//     "plan/plan": 'id',
//
//     "tasker/assignment_plan": 'id',
//   })
//   .upgrade((db) => {
//     const a = {
//       "monitor/responses": upgrade_responses,
//       "record/responses": upgrade_responses
//     }
//
//     a.forEach(key, line => db[line].toCollection().modify(a[key]))
//
//
//     function upgrade_responses(friend) {
//       friend.birthdate = new Date(Date.now() - (friend.age * YEAR));
//       delete friend.age;
//     }
//
//   })

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

