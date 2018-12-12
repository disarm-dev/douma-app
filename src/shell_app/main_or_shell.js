import {retrieve_shell_data} from 'shell_app/lib/shell_data'
import {have_enough_to_boot_main, persist_shell_data} from 'shell_app/lib/shell_data'
import {launch_shell_app, store_defaults} from 'shell_app/lib/launch_shell_app'
import {launch_main_app} from 'config/launch_main_app'
import {geodata_in_cache_and_valid} from 'lib/models/geodata/geodata.valid'
import {hydrate_geodata_cache_from_idb} from 'lib/models/geodata/local.geodata_store'

export async function main_or_shell({forget_instance = false} = {}) {
  // 'forget_instance' is set in main_app, to signal intention to return to list of instances
  if (forget_instance) persist_shell_data('instance_config', store_defaults.instance_config)

  // Rehydrate data from localStorage and try to boot straight to main_app
  const {api_url, user, personalised_instance_id, instance_config} = retrieve_shell_data()

  // Need to check geodata already exists and is correct version, and is actual geodata
  await hydrate_geodata_cache_from_idb(instance_config.instance_id)
  const geodata_valid = geodata_in_cache_and_valid()

  if (have_enough_to_boot_main({user, instance_config, personalised_instance_id}) && geodata_valid) {
    // FAST!
    launch_main_app({api_url, user, instance_config, personalised_instance_id})
  } else {
    // SLOWer!
    // Not enough to boot straight to main_app, so build up what's needed
    launch_shell_app({api_url, user, personalised_instance_id})
  }

}
