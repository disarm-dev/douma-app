import {cloneDeep, get, set} from 'lodash'


export function generate_persisted_state_options(instance_stores) {
  const unpersisted_state = generate_unpersisted_state(instance_stores)

  return create_options(unpersisted_state)
}

export function create_options(unpersisted_state) {
  if (!unpersisted_state) throw new Error('unpersisted_state object required')

  return {
    getState: (key, storage) => {
      const value = storage.getItem(key);

      try {
        return value && value !== 'undefined' ? JSON.parse(value) : undefined;
      } catch (err) {
        return undefined;
      }
    },
    setState: (key, state, storage) => {
      setTimeout(() => storage.setItem(key, JSON.stringify(state)), 0)
    },
    reducer: (state) => { state }
  }
}

export function generate_unpersisted_state(instance_stores) {
  let unpersisted_state = [{store_path: 'sw_update_available', default_value: false}, {
    store_path: 'sw_message',
    default_value: {message: null, title: null}
  }]

  for (const store_name in instance_stores) {
    const store = instance_stores[store_name]
    const paths = get(store, 'unpersisted_state_keys', [])

    paths.forEach(path => {
      const store_path = `${store_name}.${path}`
      const default_value = get(store.state, path, null)
      unpersisted_state.push({store_path, default_value})
    })
  }

  return unpersisted_state
}