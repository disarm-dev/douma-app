import test from 'ava';
import {check_input} from 'lib/helpers/csv-export/check_input'

test('can be empty array', t => {
  const data = []
  const actual = check_input(data)
  t.true(actual);
});

test('can be simple array full of stuff', t => {
  const data = [1,2,3,4]
  const actual = check_input(data)
  t.true(actual)
})

test('can be array of objects, incl. nested', t => {
  const data = [{a: 1}, {b: 2, c: {d: 3}}]
  const actual = check_input(data)
  t.true(actual)
})

test('false if string', t => {
  const data = 'some data'
  const actual = check_input(data)
  t.false(actual)
});

test('false if empty object', t => {
  const data = {}
  const actual = check_input(data)
  t.false(actual)
})