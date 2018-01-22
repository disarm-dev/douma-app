import chroma from 'chroma-js'

export function prepare_palette(layer_definition, step_count = 10) {
  let scale = chroma.scale(layer_definition.palette).colors(step_count)
  if (layer_definition.reverse_palette) scale = scale.reverse()

  const steps = [...Array(step_count).keys()].map(i => (i + 1) * 10)
  const stops = steps.map((step, index) => {
    return [step, scale[index]]
  })
  return stops
}
