import test from 'ava';
import {hidden_one} from 'lib/helpers/csv-export/flatten'

test('title', t => {
  hidden_one()
  t.is(true, true, 'nothing wrong here');
});

