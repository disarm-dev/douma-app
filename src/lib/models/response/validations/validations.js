import {Parser} from 'expr-eval'
import {get} from 'lodash'

import {CoordsSchema} from 'lib/models/response/schemas/coords.schema'
import {SelectionSchema} from 'lib/models/response/schemas/selection.schema'

export class Validator {
  constructor(validations) {
    this.validations = validations
    return this
  }

  validate(response) {
    // Validate location - only if location.selection has been set (i.e. expect coords set)

    const location_coords = get(response, 'location.coords', null)
    const location_selection = get(response, 'location.selection', null)

    const location_result = this._validate_location(location_coords)
    const location_selection_result = this._validate_location_selection(location_selection)

    // Validate main form_data / response object
    const survey_results = this._validate_form_data(response.form_data)

    // Collect the results from each type together
    const results = [].concat(location_result, location_selection_result, survey_results)

    // Collect only the {status: 'failed'} results - everything else is for information/debugging
    const failing_results = results.filter(v => v.status === 'failed')

    // Split out the types of errors
    const errors = failing_results.filter(r => r.type === 'error')
    const warnings = failing_results.filter(r => r.type === 'warning')

    return {errors, warnings}
  }

  _validate_form_data(form_data) {
    if (form_data === null) return []

    // No need to do anything if no responses
    const questions_answered = Object.keys(form_data)
    if (!questions_answered.length) return []


    const survey_validations = this.validations.map(validation => {
      // Try the precondition first, will return either false or a message
      const precondition_result = this._validate_precondition({validation, questions_answered, form_data})
      if (precondition_result.status === 'precondition_failed') return precondition_result

      // Precondition has not already returned - so either passed or doesn't exist
      const expression_result = this._validate_expression({validation, questions_answered, form_data})
      return expression_result
    })

    return survey_validations
  }

  _validate_location(coords) {
    const validation = {
      name: 'no_geo_location',
      message: 'Problem with Geolocation (GPS coordinates)',
      type: "error",
      is_location: true, // Just for a UI button to get back to location box
      status: 'failed'
    }

    if (coords === null) return validation
    if (!CoordsSchema(coords)) return validation

    return {...validation, status: 'passed'}

  }

  _validate_location_selection(selection) {
    const validation = {
      name: 'no_location_selection',
      message: 'Problem with location selection',
      type: "error",
      is_location: true,
      status: 'failed'
    }

    if (!selection) return validation
    if (!SelectionSchema(selection)) return validation

    return {...validation, status: 'passed'}
  }

  _validate_precondition({validation, questions_answered, form_data}) {
    // Check if precondition exists, can be run, and if it passes or fails
    // Return a clear message

    // No precondition, cannot run any further
    if (!validation.precondition) {
      return {...validation, questions: [], status: 'precondition_not_required'}
    }

    // Precondition exists, so create Parser, extract variables, check if they exist in the answers
    const precondition_expr = new Parser.parse(validation.precondition)
    const precondition_vars = precondition_expr.variables()
    const precondition_vars_exist = precondition_vars.every(i => questions_answered.includes(i))

    // Precondition exists, cannot yet be run
    if (!precondition_vars_exist) {
      return {...validation, questions: precondition_vars, status: 'precondition_failed'}
    }

    // Precondition exists, can be run
    if (precondition_expr.evaluate(form_data)) {
      // Precondition evaluates to true
      return {...validation, questions: precondition_vars, status: 'precondition_passed'}
    } else {
      // Precondition exists, can be run, but fails
      return {...validation, questions: precondition_vars, status: 'precondition_failed'}
    }

  }

  _validate_expression({validation, questions_answered, form_data}) {
    // Try to run the expression - either it it passes, fails, or cannot yet be run
    // Return a clear message

    // Create Parser for expression, extract variables, check if they exist in the answers
    const expression_expr = new Parser.parse(validation.expression)
    const expression_vars = expression_expr.variables()
    const expression_vars_exist = expression_vars.every(i => questions_answered.includes(i))

    // Expression cannot be run - not enough questions answered so far
    if (!expression_vars_exist) {
      return {...validation, questions: expression_vars, status: 'expression_not_ready'}
    }

    // Expression can be run
    const expression_eval_result = expression_expr.evaluate(form_data)

    if (expression_eval_result) {
      // Can run expression, and it passes
      return {...validation, questions: expression_vars, status: 'expression_passed'}
    } else {
      // Can run expression, and it fails
      return {...validation, questions: expression_vars, status: 'failed'}
    }

  }


}
