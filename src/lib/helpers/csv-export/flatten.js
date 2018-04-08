import flatten from 'flat'

function hidden_one() {
  return true
}

function make_flat(json) {
  return flatten(json)
}

export {hidden_one, make_flat}