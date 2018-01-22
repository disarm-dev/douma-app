import schema from 'js-schema'

export const CoordsSchema = schema({
  latitude: Number,
  longitude: Number,
  accuracy: Number
})
