import test from 'ava'

test('other file', t => {
  t.is(false, false, 'false is false')
})

test('objects are different', t => {
  t.deepEqual({a: 1}, {a: 1}, 'see, different')
})