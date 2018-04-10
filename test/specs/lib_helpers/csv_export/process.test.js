import test from 'ava'

import {process} from 'lib/helpers/csv-export/process'

test('simple array', t => {
  const json_array = [{a: 1}, {a: 2, b: 3}]
  t.pass()
})