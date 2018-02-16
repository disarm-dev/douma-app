export const case_location_schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://disarm.io/schemas/case_location.json",
  "title": "Case location",
  "type": "object",
  "properties": {
    "_id": {
      "type": "string",
      "minLength": 24,
      "maxLength": 24
    },
    "geometry": {
      "type": "object"
    }
  },
  "required": ["_id", "geometry"]
}