import test from 'ava'
import {configure_spatial_helpers, get_field_name_for_level} from "lib/instance_data/spatial_hierarchy_helper"


test('get_field_name_for_level should return field_name', t => {
  const instance_config = {
    spatial_hierarchy: {
      levels: [
        {
          name: 'level_1',
          field_name: 'level_1_field_name'
        },
        {
          name: 'level_2',
          field_name: 'level_2_field_name'
        }
      ]
    }
  }

  configure_spatial_helpers(instance_config)

  const expected = 'level_1_field_name'
  const actual = get_field_name_for_level('level_1')

  t.is(actual, expected)
})

