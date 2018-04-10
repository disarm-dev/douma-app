import test from 'ava'
import {create_options} from 'lib/helpers/csv-export/process'


test('basic field options, excludes blanks', t => {
  const actual = create_options(['a', ''])
  const expected = {fields: [{name: 'a'}]}

  t.deepEqual(actual, expected)
})

test('empty fields', t => {
  const actual = create_options([])
  const expected = {fields: []}

  t.deepEqual(actual, expected)
})

