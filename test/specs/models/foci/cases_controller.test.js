import test from 'ava'
import {CasesController} from "../../../../src/apps/foci/lib/models/cases/controller"


test('case controller exists', t => {
  const case_controller = new CasesController()
  t.true(case_controller instanceof CasesController)
})


test('case controller converts cases to fc', t => {
  const case_controller = new CasesController()
  const cases = [{
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

  const actual = case_controller.convert_cases_to_fc(cases)

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