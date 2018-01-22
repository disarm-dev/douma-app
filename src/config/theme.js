import Vue from 'vue'

import get from 'lodash.get'

export const configure_theme = (instance_config) => {
  const default_theme = {
    primary: 'blue',
    accent: 'pink'
  }

  const theme = get(instance_config, 'instance.theme', default_theme)

  Vue.material.registerTheme({
    default: theme
  })
}
