import Remote from './remote'
import { save_geodata_to_idb } from 'lib/models/geodata/local.geodata_store'

export async function get_and_save_layer({ level_name, instance_slug, instance_id, geodata_version}) {
  const res = await Remote.get_geodata_layer({ level_name, instance_id})

  const geodata_layer = res.data.file.geodata_data

  await save_geodata_to_idb({ level_name, level_geodata: geodata_layer, instance_slug, geodata_version })
}