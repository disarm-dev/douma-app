import test from 'ava'

import {replace_null_key_in_binned_responses} from 'apps/irs_monitor/lib/get_data_for_viz'

test('replaces null with \'other\'', t => {
  const bins = [
    {
      key: 'null'
    },
    {
      key: 'something else'
    }
  ]

  const replace_with = 'test'

  const result = replace_null_key_in_binned_responses(bins, replace_with)

  t.is(result[0].key, replace_with)
})

test('does nothing to bins without the key null', t => {
  const bins = [
    {
      key: 'not null'
    },
    {
      key: 'something else'
    }
  ]

  const replace_with = 'test'

  const result = replace_null_key_in_binned_responses(bins, replace_with)

  t.deepEqual(result, bins)

})

