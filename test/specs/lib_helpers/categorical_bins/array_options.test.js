import test from 'ava'

import {categorical_bins} from 'apps/irs_monitor/lib/bin_responses'

test('should return 1 bin for 1 array entry', t => {
  const responses = [
    {custom_name1: 1},
    {custom_name1: 2}
  ]
  const options = {
    bin_by: ['custom_name1']
  }
  const result = categorical_bins({responses, options})

  t.is(result.length, 1)
  t.is(result[0].key, 'custom_name1')
  t.deepEqual(result[0].values, responses)
})

test('should return 2 bins for 2 array entries', t => {
  const responses = [
    {custom_name1: 1, custom_name2: 1},
    {custom_name1: 2, custom_name2: 1}
  ]
  const options = {
    bin_by: ['custom_name1', 'custom_name2']
  }
  const result = categorical_bins({responses, options})

  t.is(result.length, 2)
  t.is(result[0].key, 'custom_name1')
  t.is(result[1].key, 'custom_name2')
})

