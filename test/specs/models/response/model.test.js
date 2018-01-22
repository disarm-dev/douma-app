import test from 'ava'
import {omit} from 'lodash'

import {Response} from 'lib/models/response/model.js'


const sample_valid_response = {
  instance_slug: 'test_instance',
  username: 'test_user',

  id: 'id',
  userAgent: 'chrome',
  recorded_on: 'today',

  form_data: {},
  location: {
    coords: {
      latitude: 24,
      longitude: 31,
      accuracy: 10
    },
    selection: {
      name: 'location',
      id: '1'
    }
  },
}

test('can create empty model with only the required parameters', t => {
  const fn = () => new Response({username: 'test_user', instance_slug: 'test_instance'})
  t.notThrows(fn)
})

test('cannot create a response without required parameters', t => {
  const fn = () => new Response({})
  t.throws(fn, /ResponseSchema validation failed/)
})

test('create model from existing data', t => {
  const fn = () => {
    new Response(sample_valid_response)
  }

  t.notThrows(fn)
})

test('creates a valid response by adding missing properties from defaults', t => {
  const missing_location = omit(sample_valid_response, 'location')

  const fn = () => {
    new Response(missing_location)
  }

  t.notThrows(fn, /ResponseSchema validation failed/)
})

test('should create a recorded_on and/or id property if none is passed', t => {
  const response_missing_fields = omit(sample_valid_response, 'id', 'recorded_on')
  const response = new Response(response_missing_fields)
  t.true(response.model.hasOwnProperty('id'))
  t.true(response.model.hasOwnProperty('recorded_on'))
})

