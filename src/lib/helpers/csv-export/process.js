import flatten from 'flat'

export function process(json) {
  return flatten(json)
}