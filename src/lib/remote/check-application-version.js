import {get_version} from 'lib/remote/util'
import BUILD_TIME from 'config/build-time'

/**
 * Returns object containing {status: ['CAN_UPDATE', 'ON_LATEST' or 'NO_RESPONSE'], local_version: version, remote_version: version}
 * @returns
 */
const need_to_update = () => {
  return get_version().then((remote_version) => {
    if (remote_version && (remote_version !== BUILD_TIME.VERSION_COMMIT_HASH_SHORT)) {
      console.log(`🔺 DiSARM version check: New version available ${remote_version}, can/should update.`)
      return {status: 'CAN_UPDATE', local_version: BUILD_TIME.VERSION_COMMIT_HASH_SHORT, remote_version: remote_version}
    } else {
      console.log("✅ DiSARM version check: Already running most recent version")
      return {status: 'ON_LATEST', local_version: BUILD_TIME.VERSION_COMMIT_HASH_SHORT, remote_version: remote_version}
    }
  }).catch(err => {
    console.log("🤷‍ DiSARM version check: No information on new version (network request failed)")
    return {status: "NO_RESPONSE", local_version: BUILD_TIME.VERSION_COMMIT_HASH_SHORT}
  })
}

export {need_to_update}
