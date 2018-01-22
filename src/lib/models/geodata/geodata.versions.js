/**
 *
 * @param {number} local_version
 * @param {number} required_version
 * @returns {boolean}
 */
export function versions_match(local_version, required_version) {

  const both_versions_are_numbers = Number.isInteger(local_version) && Number.isInteger(required_version)

  if (!both_versions_are_numbers) return false

  if (local_version === required_version) return true

  return false
}