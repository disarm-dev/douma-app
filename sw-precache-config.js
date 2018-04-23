module.exports = {
  cacheId: 'douma',
  root: 'dist',
  maximumFileSizeToCacheInBytes: 14194304,
  navigateFallback: 'index.html',
  navigateFallbackWhitelist: [/^\/(?!reset_offline)./],
  importScripts: ['offline-analytics.js'],
  staticFileGlobsIgnorePatterns: [
    /\/reset_offline\.html/,
    /\.map$/,
    /\.json$/,
    /VERSION/,
    /COMMITHASH/
  ],
  runtimeCaching: [
    {
      urlPattern: /(api|tiles)\.mapbox\.com/,
      handler: 'cacheFirst'
    }
  ]
}

