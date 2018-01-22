import test from 'ava'
import sinon from 'sinon'
import moxios from 'moxios'

import remote from 'lib/models/response/remote'

test.beforeEach(() => {
  moxios.install()
})

test.afterEach(() => {
  moxios.uninstall()
})


test.cb('test test', t => {
  const callback = sinon.spy()

  remote.read_all().then(callback)

  moxios.wait(function () {
    let request = moxios.requests.mostRecent()
    request.respondWith({
      status: 200,
      response: [
        { id: 1, firstName: 'Fred', lastName: 'Flintstone' },
        { id: 2, firstName: 'Wilma', lastName: 'Flintstone' }
      ]
    }).then(function () {
      t.true(callback.calledOnce)
      t.end()
    })
  })

})
