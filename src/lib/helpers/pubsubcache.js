// basic pubsub module with cache!
// enables us to start publishing to a channel,
// and for later subscribers to replay the messages
// stores max of 10 messages
// source: internet, undated

let topics = {};//sw: [{token: 1, func: () => {}}]}
let subUid = -1
let cache = {};//sw: ['args', 'args2']}

export default {

  subscribe: (topic, func) => {
    if (!topics[topic]) {
      topics[topic] = []
    }
    const token = (++subUid).toString()
    topics[topic].push({
      token: token,
      func: func
    })

    setTimeout(() => {
      if (cache[topic]) {
        for (const args of cache[topic]) {
          func(topic, args)
        }
        delete cache[topic]
      }
    }, 0)

    return token
  },

  publish: (topic, args) => {
    if (!cache[topic]) cache[topic] = []
    cache[topic].push(args)
    if (cache[topic].length > 10) cache[topic].splice(9, cache[topic].length - 10)

    setTimeout(() => {
      const subscribers = topics[topic]
      let len = subscribers ? subscribers.length : 0

      while (len--) {
        subscribers[len].func(topic, args)
      }
    }, 0)
    return true

  },

  unsubscribe: token => {
    for (const m in topics) {
      if (topics[m]) {
        for (let i = 0, j = topics[m].length; i < j; i++) {
          if (topics[m][i].token === token) {
            topics[m].splice(i, 1)
            return token
          }
        }
      }
    }
    return false
  }

}
