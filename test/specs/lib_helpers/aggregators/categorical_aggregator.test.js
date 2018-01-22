import test from 'ava'
import {Parser} from 'expr-eval'
import {categorical_aggregator} from "lib/models/response/aggregations/aggregator"

test('should return empty object if passed an empty array of responses', t => {
  const responses = []
  const expression = undefined

  const actual = categorical_aggregator(responses, expression)
  const expected = {}

  t.deepEqual(actual, expected)
})

test('returns simple count of occurrences of properties', t => {
  const responses = [{form_data: {color: ['red']}}, {form_data: {color: ['blue']}}, {form_data: {color: ['red']}}]
  const expression = new Parser.parse('color')

  const actual = categorical_aggregator(responses, expression)
  const expected = {
    red: 2,
    blue: 1
  }

  t.deepEqual(actual, expected)
})