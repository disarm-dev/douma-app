// Configure Google Analytics on router for page-tracking only for production
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

import BUILD_TIME from 'config/build-time'

const instantiate_analytics = (router, store) => {
  if (BUILD_TIME.DOUMA_PRODUCTION_MODE) {
    const dimension1 = BUILD_TIME.VERSION_COMMIT_HASH_SHORT // Version
    const dimension2 = store.state.instance_config.instance.slug // slug
    const dimension3 = store.state.meta.user ? `${store.state.meta.user.username}/${store.state.meta.user.name}` : 'no user' // User

    Vue.use(VueAnalytics, {
      id: BUILD_TIME.GA_ANALYTICS_UA,
      router,
      set: [{field: 'dimension1', value: dimension1}, {field: 'dimension2', value: dimension2}, {field: 'dimension3', value: dimension3}]
    })
  } else {
    const fake_plugin = {
      install(Vue, options) {
        Vue.prototype.$ga = {
          event() {},
          set() {},
          fake_plugin: true
        }
      }
    }
    Vue.use(fake_plugin)
  }
}

export {instantiate_analytics}
