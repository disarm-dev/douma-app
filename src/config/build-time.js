// See `webpack.base.conf.js`

// Set some defaults for testing, and anything else that doesn't use webpack
const VERSION_COMMIT_HASH_SHORT = (typeof __VERSION_COMMIT_HASH_SHORT === 'undefined') ? 'DEFAULT TESTING HASH' : __VERSION_COMMIT_HASH_SHORT
const BRANCH = (typeof __BRANCH === 'undefined') ? 'DEFAULT TESTING BRANCH' : __BRANCH
const DOUMA_PRODUCTION_MODE = (typeof __DOUMA_PRODUCTION_MODE === 'undefined') ? 'true' : __DOUMA_PRODUCTION_MODE
const GA_ANALYTICS_UA = (typeof __GA_ANALYTICS_UA === 'undefined') ? '' : __GA_ANALYTICS_UA

export default {
  VERSION_COMMIT_HASH_SHORT: VERSION_COMMIT_HASH_SHORT,
  BRANCH: BRANCH,
  DOUMA_PRODUCTION_MODE: DOUMA_PRODUCTION_MODE,
  GA_ANALYTICS_UA: GA_ANALYTICS_UA
}
