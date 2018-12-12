import Remote from './remote'
import { save_geodata_to_idb } from 'lib/models/geodata/local.geodata_store'
import CONFIG from '@/config/common'

export async function get_and_save_layer({ level_id, instance_slug, instance_id, geodata_version}) {
  const res = await Remote.get_geodata_layer({ level_id })

  const geodata_layer = res.data

  await save_geodata_to_idb({ level_name:geodata_layer.level_name, level_geodata: geodata_layer.geojson, instance_slug, geodata_version })
}

export function geodata_required(permissions, instance_id) {

  const instance_permission_values = permissions.filter(p => p.instance_id === instance_id).map(p => p.value)

  const permission_applet_names = instance_permission_values.map(p => {
    return p.split(':')[1]
  })

  const applet_names = Object.keys(CONFIG.applets)

  const applet_names_requiring_geodata = applet_names.filter(applet_name => {
    const applet = CONFIG.applets[applet_name]
    return applet.geodata_required
  })
  
  return permission_applet_names.some(applet_name => {
    return applet_names_requiring_geodata.includes(applet_name)
  })
}