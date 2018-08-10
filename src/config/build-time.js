// See `webpack.base.conf.js`
const CUSTOM_STAGING_API_URL = (typeof __CUSTOM_STAGING_API_URL === 'undefined') ? 'https://douma-stage.api.disarm.io' : __CUSTOM_STAGING_API_URL
const CUSTOM_PRODUCTION_API_URL = (typeof __CUSTOM_PRODUCTION_API_URL === 'undefined') ? 'https://douma.api.disarm.io' : __CUSTOM_PRODUCTION_API_URL

// Set some defaults for testing, and anything else that doesn't use webpack
const VERSION_COMMIT_HASH_SHORT = (typeof __VERSION_COMMIT_HASH_SHORT === 'undefined') ? 'DEFAULT TESTING HASH' : __VERSION_COMMIT_HASH_SHORT
const BRANCH = (typeof __BRANCH === 'undefined') ? 'DEFAULT TESTING BRANCH' : __BRANCH
const DOUMA_PRODUCTION_MODE = (typeof __DOUMA_PRODUCTION_MODE === 'undefined') ? 'true' : __DOUMA_PRODUCTION_MODE
const GA_ANALYTICS_UA = (typeof __GA_ANALYTICS_UA === 'undefined') ? '' : __GA_ANALYTICS_UA
// const CUSTOM_STAGING_API_URL = (typeof __CUSTOM_STAGING_API_URL === 'undefined') ? 'https://douma-stage.api.disarm.io' : __CUSTOM_STAGING_API_URL


export default {
  VERSION_COMMIT_HASH_SHORT: VERSION_COMMIT_HASH_SHORT,
  BRANCH: BRANCH,
  DOUMA_PRODUCTION_MODE: DOUMA_PRODUCTION_MODE,
  GA_ANALYTICS_UA: GA_ANALYTICS_UA,
  CUSTOM_STAGING_API_URL: CUSTOM_STAGING_API_URL,
  CUSTOM_PRODUCTION_API_URL: CUSTOM_PRODUCTION_API_URL
}
