import flatten from 'flat'
import jsoncsv from 'json-csv'

export function process(json_array) {
  // flatten every record
  const flattened = json_array.map(record => flatten(record))
  const fields = unique_fields(flattened)
  const options = create_options(fields)

  // convert to CSV string from JSON using options
  jsoncsv.csvBuffered(json_array, options)
}

/**
 * Convert array of field names to the `options` for `json-csv`
 * @param fields_array
 * @returns {{fields: *}}
 */
export function create_options(fields_array) {
  // Drop any blanks, create array
  const fields = fields_array.filter(i => i).map(field => {
    return {name: field}
  })

  return {
    fields: fields
  }
}

export function unique_fields(json_array) {
  let fields = new Set
  json_array.forEach(record => {
    Object.keys(record).forEach(key => fields.add(key))
  })
  return Array.from(fields)
}