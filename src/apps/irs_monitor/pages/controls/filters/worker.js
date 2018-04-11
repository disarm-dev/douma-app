import {has, get, sort} from 'lodash'
import flow from 'lodash/fp/flow'
import flatten from 'lodash/fp/flatten'
import uniq from 'lodash/fp/uniq'
import sortBy from 'lodash/fp/sortBy'
import map from 'lodash/fp/map'


const EXCLUDE_FIELD_FILTER = f => !f.startsWith('location')

// Respond to message from parent thread
self.addEventListener('message', (event) => {
  console.log('worker event', event.data)

  if (!has(event.data, 'responses')) return // check right kind of message

  let result = []
  let all_field_names = []
  const responses = event.data.responses

  if (responses && responses.length > 0) {

    responses.forEach(response => {
      const nested_keys = extract_nested_keys(response)
      all_field_names.push(nested_keys)
    })

    const flattened = flow(
      flatten,
      uniq,
      sortBy(x => x)
    )(all_field_names)

    result = flattened.filter(EXCLUDE_FIELD_FILTER)
  }

  // Post data to parent thread
  self.postMessage(result)
})



function extract_nested_keys(data) {
  var result = {};

  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++)
        recurse(cur[i], prop + '[' + i + ']');
      if (l === 0)
        result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + '.' + p : p);
      }
      if (isEmpty && prop)
        result[prop] = {};
    }
  }

  recurse(data, '');
  return Object.keys(result);
}


