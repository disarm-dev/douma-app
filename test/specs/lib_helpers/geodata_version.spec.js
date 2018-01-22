import test from 'ava'
import {versions_match} from "lib/models/geodata/geodata.versions"

test('returns false if no local version', t => {
  const local_version = null
  const required_version = 1

  const result = versions_match(local_version, required_version)

  t.false(result)
})

test('returns false if no local version', t => {
  const local_version = undefined
  const required_version = 1

  const result = versions_match(local_version, required_version)

  t.false(result)
})

test('returns false if no local version', t => {
  const local_version = ''
  const required_version = 1

  const result = versions_match(local_version, required_version)

  t.false(result)
})


test('return false if no required version', t => {
  const local_version = 1
  const required_version = null

  const result = versions_match(local_version, required_version)

  t.false(result)
})

test('return true if versions are numbers and are the same', t => {
  const local_version = 1
  const required_version = 1

  const result = versions_match(local_version, required_version)

  t.true(result)
})

test('returns false if local version is lower than required version', t => {
  const local_version = 1
  const required_version = 2

  const result = versions_match(local_version, required_version)

  t.false(result)
})

test('returns false if required version is lower than local version', t => {
  const local_version = 2
  const required_version = 1

  const result = versions_match(local_version, required_version)

  t.false(result)
})

test('returns false if BOTH params are not a number', t => {
  const local_version = null
  const required_version = null

  const result = versions_match(local_version, required_version)

  t.false(result)
})

test('returns false if local version is not a number', t => {
  const local_version = '1'
  const required_version = 1

  const result = versions_match(local_version, required_version)

  t.false(result)
})
