// TODO: @refac Move importScripts to sw-precache config

importScripts('offline-google-analytics-import.min.js');

goog.offlineGoogleAnalytics.initialize();