import test from 'ava'

import {process} from 'lib/helpers/csv-export/process'

test('simple array', t => {
  const json_array = [{a: 1}, {a: 2, b: 3}]
  const actual = process(json_array)
  const expected = '"a","b"\n1,\n2,3'

  t.is(actual, expected)
})

test('nested', t => {
  const json_array = [{a: 1, nested: {b: 2}},{a: 2}]
  const actual = process(json_array)
  const expected = '"a","nested.b"\n1,2\n2,'

  t.is(actual, expected)
})