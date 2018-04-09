import test from 'ava';

function process(thing) {
  return [['a'], [1], [2]]
}

test('single level', t => {
  const start_with = [{a: 1}, {a: 2}]
  const end_with = [['a'], [1], [2]]
  const result = process(start_with)
  t.deepEqual(end_with, result)
});