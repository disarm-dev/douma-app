// TODO: Move this out of douma and into it's own package that can be used on the server as well.
export const case_cluster_schema = {
  "title": "Case cluster",
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
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
    }
  },
  "required": ["_id", "status", "investigation_status", "geometry"]
}