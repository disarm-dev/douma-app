import test from 'ava'
import cache from 'config/cache'
import {get_geodata_for_level_name} from "lib/helpers/geodata_helpers"

test('get_geodata_for_level_name should return geodata', t => {
  const level_name = 'name'
  const expected = {value: 'geodata'}
  cache.geodata[level_name] = expected

  const actual = get_geodata_for_level_name(level_name)

  t.deepEqual(actual, expected)
})