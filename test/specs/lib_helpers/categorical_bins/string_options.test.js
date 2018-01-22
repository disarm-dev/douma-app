import test from 'ava'

import {categorical_bins} from 'apps/irs_monitor/lib/bin_responses'


test('options.bin_by as string', t => {
  const responses = [
    {type: 1},
    {type: 2},
    {type: 1}
  ]
  const options = {
    bin_by: 'type'
  }
  const result = categorical_bins({responses, options})

  t.is(result.length, 2)
  t.is(result[0].values.length, 2)

  t.is(result[0].key, '1')
  t.is(result[1].key, '2')
})
