const json2csv = require('json2csv').parse;

export function process(json_array) {
  // flatten every record
  const opts = {flatten: true}

  // convert to CSV string from JSON using options
  return json2csv(json_array, opts)
}
