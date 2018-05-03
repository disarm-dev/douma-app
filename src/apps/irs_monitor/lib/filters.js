import {get} from 'lodash'
import {Parser} from 'expr-eval'

export function filter_responses(responses, filters = []) {
  // For loop is faster by 10x than Array#filter
  let output = []
  for (let i = 0; i < responses.length; i++) {
    let response = responses[i]
    if (filter_response(response, filters)) output.push(response)
  }
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
