import test from 'ava'

import {geodata_versions_correct} from 'lib/models/geodata/geodata.valid'

test('returns false if versions for all levels do not match required', t => {
  const geodata = {
    top: {
      _version: 1
    },
    bottom: {
      _version: 2
    }
  }

  const required_version = 1

  const result = geodata_versions_correct(geodata, required_version)

  t.false(result)

})

test('returns true if versions for all levels match required', t => {
  const geodata = {
    top: {
      _version: 1
    },
    bottom: {
      _version: 1
    }
  }

  const required_version = 1

  const result = geodata_versions_correct(geodata, required_version)

  t.true(result)
})

test('returns false if a version is missing', t => {
  const geodata = {
    top: {},
    bottom: {
      _version: 1
    }
  }

  const required_version = 1

  const result = geodata_versions_correct(geodata, required_version)

  t.false(result)
})
