import {cloneDeep as clone_deep, isEqual as is_equal} from 'lodash'


/**
 * Set filter on filters collection
 * @param  {Object} filters_collection A filters object
 * @param  {String} filter_name        One of 'spatial', 'temporal' or 'Fields'
 * @param  {Object} filter_object      Value of filter to set
 * @return {Object}                    A filters collection
 */
export const set_filter = (filters_collection, filter_name, filter_object) => {
  const collection_clone = clone_deep(filters_collection)
  switch (filter_name) {
    case 'temporal':
      collection_clone.temporal = filter_object
      break;
    case 'spatial':
      collection_clone.spatial = filter_object
      break;
    default:
      // Fields
      const index = collection_clone.fields.findIndex(a => is_equal(a, filter_name_or_object))

      if (index !== 0) return

      collection_clone.fields.push(filter_object)
  }
  return collection_clone
}

/**
 * Unset Filter
 * @param  {Object} filters_collection    A filters object
 * @param  {String | Object} filter_name_or_object Either 'spatial', 'temporal' or a fields object
 * @param  {Array} responses             Array of responses
 * @return {Object}                       A filters collection
 */
export const unset_filter = (filters_collection, filter_name_or_object, responses) => {
  const collection_clone = clone_deep(filters_collection)


  if (filter_name_or_object === 'spatial') {
    collection_clone.spatial = null
    return collection_clone
  }

  if (filter_name_or_object === 'temporal') {
    collection_clone.temporal = get_date_range(responses)
    return collection_clone
  }


  // filter_name_or_object = {
  //   team_name: 'Team 1'
  // }

  // collection_clone.fields = [{
  //   team_name: 'Team 1'
  // }, {
  //   team_name: 'Team 2'
  // }, {
  //   colour: 'red'
  // }]

  // If it is none of the above it must be a field
  const index = collection_clone.fields.findIndex(a => is_equal(a, filter_name_or_object))
  collection_clone.splice(index, 1)
  return collection_clone
}
