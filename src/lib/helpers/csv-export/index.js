import {check_input} from './check_input'
import {process} from './process'

/**
 * Take an array of odd-shaped and nested JSON, return the CSV string
 * @param json_array
 * @returns {*}
 */
export function flatten_json_to_csv(json_array) {
  if (!check_input(json_array)) return []
  return process(json_array)
}