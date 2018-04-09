import test from 'ava';
import {check_input} from 'lib/helpers/csv-export/check_input'

test('takes Array', t => {
  const data = []
  const actual = check_input(data)
  t.true(actual);
});

test('breaks if string', t => {
  const data = 'some data'
  const actual = check_input(data)
  t.false(actual)
});

