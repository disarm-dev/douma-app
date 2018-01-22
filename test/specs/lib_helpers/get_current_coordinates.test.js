import test from 'ava'
import {determine_response} from "lib/helpers/get_current_coordinates"

test('returns error message if there are no positions', async t => {
  try {
    await determine_response([], [{message: 'error timeout'}])
  } catch (actual) {
    const expected = {message: 'error timeout'}
    t.deepEqual(actual, expected)
  }
})


test('returns a position if there is only one position', async t => {
  const positions = [{coords: {accuracy: 10}}]
  const errors = []

  const actual = await determine_response(positions, errors)
  const expected = {coords: {accuracy: 10}}

  t.deepEqual(actual, expected)
})

test('returns the most accurate position if more than one', async t => {
  const positions = [{coords: {accuracy: 10}}, {coords: {accuracy: 15}},  {coords: {accuracy: 8}}]
  const errors = []

  const actual = await determine_response(positions, errors)
  const expected = {coords: {accuracy: 8}}

  t.deepEqual(actual, expected)
})

test('should return position if there are positions and errors', async t => {
  const positions = [{coords: {accuracy: 10}}, {coords: {accuracy: 15}},  {coords: {accuracy: 8}}]
  const errors = [{message: 'error timeout'}]

  const actual = await determine_response(positions, errors)
  const expected = {coords: {accuracy: 8}}

  t.deepEqual(actual, expected)
})