import test from 'ava'

import {categorical_bins} from 'apps/irs_monitor/lib/bin_responses'


test('should throw when no options are passed in', t => {
  const responses = [
    {type: 1},
    {type: 2},
    {type: 1}
  ]
  const fn = categorical_bins.bind(this, {responses})
  t.throws(fn, 'Missing options.bin_by')
})

test('should throw error if options.bin_by string is empty', t => {
  const responses = []
  const options = {
    bin_by: ''
  }
  const fn = categorical_bins.bind(this, {responses, options})
  t.throws(fn, 'bin_by must not be an empty string or empty array')
})

test('should throw error if options.bin_by array is empty', t => {
  const responses = []
  const options = {
    bin_by: []
  }
  const fn = categorical_bins.bind(this, {responses, options})
  t.throws(fn, 'bin_by must not be an empty string or empty array')
})

