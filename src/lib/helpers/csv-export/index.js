import {check_input} from './check_input'
import {process} from './process'
import {format_output} from './format_output'

export function do_thing(with_this) {
  check_input(with_this)
  process(with_this)
  return format_output(with_this)
}