import {Parser} from 'expr-eval'


/**
 * Takes responses and decorates them with new properties under the '_decorated' key.
 * It uses the 'decorators' from the instance_config to figure out which properties to calculate.
 * @param  {Array} responses
 * @param  {Object} instance_config
 * @return {Array} responses
 */
export default function instance_decorator(responses, instance_config) {
  const decorators = instance_config.decorators

  const decorated_responses = responses.map((response) => {
    return evaluate_decorators(response, decorators)
  })

  return decorated_responses
}

/**
 * Add decorators to a single response
 * @param  {Object} response
 * @param  {Object} decorators
 * @return {response}
 */
const evaluate_decorators = (response, decorators) => {
  const decorated_value_names = Object.keys(decorators)

  // Loop over the decorators
  const decorated_values = decorated_value_names.reduce((result, decorated_value_name) => {
    const decorator_expressions_array = decorators[decorated_value_name]

    result[decorated_value_name] = evaluate_decorator(response, decorator_expressions_array)

    return result
  }, {})

  // Attach the decorated values to the response and return it
  response._decorated = decorated_values
  return response
}

const evaluate_decorator = (response, decorator_expressions_array) => {
  let result

  // expression is something like {"red": "any_sprayed === true"},
  decorator_expressions_array.forEach(expression_definition => {
    // possible_value_name is 'red'
    const value = Object.keys(expression_definition)[0]

    // expression is "any_sprayed === true"
    const expression = expression_definition[value]

    const parser = new Parser(expression)

    const parsed_expresssion = parser.parse(expression)

    if (form_data_has_required_variables(response, parsed_expresssion.variables())) {
      const evaluation_result = parsed_expresssion.evaluate(response.form_data)

      // evaluation_result is a boolean
      if (evaluation_result) {
        result = value
      }
    }
  })

  return result
}


// TODO: @refac Move this somewhere more generic (probably already exists)
const form_data_has_required_variables = (response, required_variables) => {
  const response_variables = Object.keys(response.form_data)

  for (const required of required_variables) {
    if (!response_variables.includes(required)) {
      return false
    }
  }

  return true
}
