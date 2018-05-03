import {get} from 'lodash'
import {Parser} from 'expr-eval'
export function filter_responses(responses, filters = []) {
  console.timeStamp('start filter')
  console.time('filter')
  const filtered = responses.filter((response) => {
    return filter_response(response, filters)
  })
  console.timeEnd('filter')
  console.timeStamp('filter')

  console.time('for')
  let output = []
  for (let i = 0; i < responses.length; i++) {
    if (filter_response(response, filters)) output.push(response)
  }
  console.timeEnd('for')
  console.timeStamp('for')

  console.assert(filtered.length === output.length, "Mismatched result length")

  return output
}


function filter_response(response, filters) {
  return filters.every(filter => {
    const {name, comparator, value} = filter
    let value_from_filter = value

    let value_from_response = get(response, name, null)

    if (value_from_response === null) return

    // TODO: @refac Find another way to convert string to int
    if (name === 'recorded_on') {
      value_from_response = new Date(value_from_response).getTime()
      const millis_in_a_day = 86400000
      let filter_value_in_days = Math.floor(new Date(value).getTime()/millis_in_a_day)
      let value_from_response_in_days = Math.floor(new Date(value_from_response).getTime()/millis_in_a_day)
      value_from_filter = filter_value_in_days
      value_from_response = value_from_response_in_days
    }

    // if string, enclose in single quotes
    if (typeof value_from_filter === 'string') {
      value_from_filter = `'${value_from_filter}'`
    }

    const expr_string = `value_from_response ${comparator} ${value_from_filter}`
    const variables = { value_from_response }


    return Parser.evaluate(expr_string, variables)
  })
}

// function filter_function(value_from_response, comparator, value_from_filter) {
//   const accepted_comparators = ['==', '>=', '<=', '>', '<', '!=']
// }
