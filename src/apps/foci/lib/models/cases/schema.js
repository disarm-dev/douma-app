export const case_schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://disarm.io/schemas/case.json",
  "title": "Case",
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "geometry": {
      "type": "object"
    }
  },
  "required": ["_id", "geometry"]
}