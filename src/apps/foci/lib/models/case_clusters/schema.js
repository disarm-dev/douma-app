// TODO: Move this out of douma and into it's own package that can be used on the server as well.
export const case_cluster_schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://disarm.io/schemas/case_cluster.json",
  "title": "Case cluster",
  "type": "object",
  "properties": {
    "_id": {
      "type": "string",
      "minLength": 24,
      "maxLength": 24
    },
    "investigation_status": {
      "type": "string",
      "enum": [
        "investigated",
        "suggested",
        "visual review"
      ]
    },
    "status": {
      "type": "string",
      "enum": [
        "active",
        "inactive",
        "cleared" 
      ]
    },
    "geometry": {
      "type": "object"
    },
    "updated_at": {
      "type": "number"
    },
    "personalised_instance_id": {
      "type": "string"
    }
  },
  "required": ["_id", "status", "investigation_status", "geometry"]
}