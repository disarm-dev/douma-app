import get from 'lodash.get'
import uniq from 'lodash.uniq'

import {get_form_fields} from 'lib/instance_data/form_helpers'

function extract_map_style_field(presenters) {
  const map_style = presenters.map_style
  return get(map_style, 'circle-color.property', '')
}

function extract_popup_description_fields(presenters) {
  const popup_description = presenters.popup_description
  return uniq(popup_description.map(line => line.field))
}

/**
 *
 * @param presenters
 * @param form
 * @returns {boolean}
 */
const fields_for_presenters_exist_in_form = ({presenters, form}) => {
  const map_style_field = extract_map_style_field(presenters)
  const popup_description_fields = extract_popup_description_fields(presenters)

  const presenter_fields = uniq(popup_description_fields.push(map_style_field))
  const form_fields = get_form_fields(form)

  return presenter_fields.every(val => form_fields.indexOf(val) >= 0)
}

export {fields_for_presenters_exist_in_form}
