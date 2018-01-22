import flatten from 'lodash.flatten'
import uniq from 'lodash.uniq'
import intersection from 'lodash.intersection'
import difference from 'lodash.difference'

import {get_form_fields} from 'lib/instance_data/form_helpers'

function extract_fake_form_fields(fake_form) {
  const all_fields = fake_form.map(f => Object.keys(f))
  return uniq(flatten(all_fields))
}

/**
 *
 * @param fake_form
 * @param form
 * @returns {boolean}
 */
const fields_for_fake_form_exist_in_form = ({fake_form, form}) => {
  const fake_form_fields = extract_fake_form_fields(fake_form)
  const form_fields = get_form_fields(form)
  const intersec = intersection(fake_form_fields, form_fields)

  return fake_form_fields.every(val => form_fields.indexOf(val) >= 0)
}

export {fields_for_fake_form_exist_in_form}
