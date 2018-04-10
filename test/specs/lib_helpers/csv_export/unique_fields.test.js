import test from 'ava';

import {unique_fields} from 'lib/helpers/csv-export/process'

test('get simple unique fields', t => {
  const data = [{a: 1}, {a: 2},{a: 1}]
  const actual = unique_fields(data)
  const expected = ['a']

  t.is(expected.length, actual.length)
  t.deepEqual(actual, expected)
})

test('get multiple unique fields', t => {
  const data = [{a: 1}, {a: 2, b: 3}, {a: 1}]
  const actual = unique_fields(data)
  const expected = ['a', 'b']

  t.is(expected.length, actual.length)
  t.deepEqual(actual, expected)
})

test('no prob if no fields', t => {
  const data = []
  const actual = unique_fields(data)
  const expected = []

  t.is(expected.length, actual.length)
  t.deepEqual(actual, expected)
})

