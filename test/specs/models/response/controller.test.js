import test from 'ava'
import sinon from 'sinon'

import {ResponseController} from "lib/models/response/controller"

function setup_read_all_network() {
  const responses = [{id: 1}, {id: 2}]

  const read_all = sinon.stub().returns(Promise.resolve(responses))
  const remote = {read_all}

  const create_bulk = sinon.stub().returns(Promise.resolve())
  const remove_all = sinon.stub().returns(Promise.resolve())
  const local = {create_bulk, remove_all}

  const controller = new ResponseController('test')

  controller.local = local
  controller.remote = remote

  return {responses, controller}
}

test("can be instantiated", t => {
  const controller = new ResponseController('test')
  t.true(controller instanceof ResponseController)
})

test.skip.cb("calls remote methods in read_all_network ", t => {
  const {controller} = setup_read_all_network()

  controller.read_all_network().then(() => {
    t.true(controller.remote.read_all.calledOnce)
    t.end()
  })
})

test.skip.failing.cb("calls local methods in read_all_network with correct arguments", t => {
  const {responses, controller} = setup_read_all_network()

  controller.read_all_network().then(() => {
    t.true(controller.local.create_or_update_bulk.calledOnce)
    t.true(controller.local.remove_all.calledOnce)
    t.deepEqual(responses, controller.local.create_or_update_bulk.getCall(0).args[0])

    t.end()
  })
})

test.skip.failing.cb("read_all_network returns responses", t => {
  const {responses, controller} = setup_read_all_network()

  controller.read_all_network().then((actual) => {
    t.deepEqual(responses, actual)
    t.end()
  })
})

test.cb("calls local methods in read_all_cache", t => {
  const controller = new ResponseController('test')

  controller.local = {read_all: sinon.stub().returns(Promise.resolve([]))}

  controller.read_all_cache({personalised_instance_id: 'id', instance: 'instance'}).then((actual) => {
    t.true(controller.local.read_all.calledOnce)
    t.end()
  })
})


test.cb("calls local methods in read_all_cache with correct arguments", t => {
  const responses = [{id: 1, personalised_instance_id: 'id', instance_slug: 'instance'}, {id: 2, personalised_instance_id: 'id', instance_slug: 'instance'}]
  const controller = new ResponseController('test')

  controller.local = {read_all: sinon.stub().returns(Promise.resolve(responses))}

  controller.read_all_cache({personalised_instance_id: 'id', instance: 'instance'}).then((actual) => {
    t.deepEqual(responses, actual)
    t.end()
  })
})


test.cb("calls remote methods in create_batch_network", t => {
  const controller = new ResponseController('test')

  controller.remote = {create: sinon.stub().returns(Promise.resolve())}

  controller.create_batch_network().then(() => {
    t.true(controller.remote.create.calledOnce)
    t.end()
  })
})


test.cb("calls local methods in create_batch_network with correct arguments", t => {
  const responses = [{id: 1}, {id: 2}]
  const controller = new ResponseController('test')

  controller.remote = {create: sinon.stub().returns(Promise.resolve())}

  controller.create_batch_network(responses).then(() => {
    t.deepEqual(responses, controller.remote.create.getCall(0).args[0])
    t.end()
  })
})

