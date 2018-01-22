import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import get from 'lodash.get'
import BUILD_TIME from 'config/build-time'

const configure_error_tracking = ()=> {
  // Keep track of Errors
  if (process.env.NODE_ENV !== 'development') {
    Raven
      .config('https://05f42524abca4b84ba7a9b9d05fb620a@sentry.io/134727', {
        release: BUILD_TIME.VERSION_COMMIT_HASH_SHORT
      })
      .addPlugin(RavenVue, Vue)
      .install()
  }
}

// Add extra info to error logging
const set_raven_user_context = (state) => {

  const user_context = {
    personalised_instance_id: get(state, 'meta.personalised_instance_id', 'not_set'),
    user: get(state, 'meta.user', 'not_set'),
    username: get(state, 'meta.user.username', 'not_set')
  }

  const tags = {
    instance_slug: state.instance_config.instance.slug,
    branch: BUILD_TIME.BRANCH
  }

  Raven.setUserContext(user_context)
  Raven.setTagsContext(tags)
}

export {configure_error_tracking, set_raven_user_context}
