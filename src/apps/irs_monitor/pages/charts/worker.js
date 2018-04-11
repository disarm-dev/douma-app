
// Respond to message from parent thread
self.addEventListener('message', (event) => console.log('worker event', event.data))

// Post data to parent thread
self.postMessage({ foo: 'foo' })
