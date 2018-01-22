module.exports = {
  cacheId: 'douma',
  root: 'dist',
  maximumFileSizeToCacheInBytes: 14194304,
  navigateFallback: 'index.html',
  importScripts: ['offline-analytics.js'],
  staticFileGlobsIgnorePatterns: [
    /\.map$/,
    /\/static\/?(?:[^\/]+\/?)*$/,
    /VERSION/,
    /COMMITHASH/
  ],
  runtimeCaching: [
    {
      urlPattern: /\/static\/?(?:[^\/]+\/?)*$/,
      handler: 'networkFirst'
    },
    {
      urlPattern: /(api|tiles)\.mapbox\.com/,
      handler: 'cacheFirst'
    }
  ],
  skipWaiting: true
}

