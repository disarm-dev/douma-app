import {get} from 'lodash'
import {Parser} from 'expr-eval'
export function filter_responses(responses, filters = []) {
  return responses.filter((response) => {
    return filter_response(response, filters)
  })
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