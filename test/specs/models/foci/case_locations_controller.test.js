import test from 'ava'
import {CaseLocationsController} from "../../../../src/apps/foci/lib/models/case_locations/controller"


test('case controller exists', t => {
  const case_controller = new CaseLocationsController()
  t.true(case_controller instanceof CaseLocationsController)
})


test('case controller converts case_locations to fc', t => {
  const case_controller = new CaseLocationsController()
  const case_locations = [{
    "id": "f8275210-60af-410b-a621-d97a4e113fa3",
    "geometry": {
      "type": "Point",
      "coordinates": [
        31.243057250976562,
        -25.867873706693747
      ]
    }
  },
    {
      "id": "4f74c2c2-ea39-4f13-a5c2-59c2187e4d54",
      "geometry": {
        "type": "Point",
        "coordinates": [
          31.196880340576172,
          -25.931031499716866
        ]
      }
    }
  ]

  const actual = case_controller.convert_case_locations_to_fc(case_locations)

  const expected = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "id": "f8275210-60af-410b-a621-d97a4e113fa3"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            31.243057250976562,
            -25.867873706693747
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "id": "4f74c2c2-ea39-4f13-a5c2-59c2187e4d54"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            31.196880340576172,
            -25.931031499716866
          ]
        }
      }
    ]
  }

  t.deepEqual(actual, expected)
})