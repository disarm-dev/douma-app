import test from 'ava'

import {filter_responses} from 'apps/irs_monitor/lib/filters'

test('should return all responses if no filters are passed', t => {
  const responses = [
    {name: 1},
    {name: 2},
    {name: 3}
  ]

  const result = filter_responses(responses)

  t.deepEqual(result, responses)
})

test('should filter responses using an equality filter', t => {
  const responses = [
    {name: 1},
    {name: 2},
    {name: 3}
  ]

  const filter = {name: 'name', comparator: '==', value: 2}

  const result = filter_responses(responses, [filter])

  const expected = [
    {name: 2}
  ]

  t.deepEqual(result, expected)
})

test('should filter responses using a greater than filter', t => {
  const responses = [
    {name: 1},
    {name: 2},
    {name: 3}
  ]

  const filter = {name: 'name', comparator: '>', value: 2}

  const result = filter_responses(responses, [filter])

  const expected = [
    {name: 3}
  ]

  t.deepEqual(result, expected)
})

test('should filter responses using a smaller than filter', t => {
  const responses = [
    {name: 1},
    {name: 2},
    {name: 3}
  ]

  const filter = {name: 'name', comparator: '<', value: 2}

  const result = filter_responses(responses, [filter])

  const expected = [
    {name: 1}
  ]

  t.deepEqual(result, expected)
})
