module.exports = {
  "globDirectory": "build/default/",
  "globPatterns": [
    "**/*.{html,js}"
  ],
  "swDest": "build/default/sw.js",
  "globIgnores": [
    "../../workbox-cli-config.js"
  ],
  /**
   * Added config options below. Don't forget the trailing comma (,) above.
   */

  /**
   * Activate this service worker on all active clients without reloading the page.
   */
  "skipWaiting": true,
  "clientsClaim": true,

  /**
   * All navigate requests should serve the contents of "index.html".
   */
  "navigateFallback": "index.html",

  "runtimeCaching": [
    /**
     * Use the "network-first" strategy for data. This means users will always get
     * up-to-date data if they have a reliable network connection, but falls back to
     * cached content otherwise.
     */
    {
      "urlPattern": /^https:\/\/audiostream-89853\.firebaseio\.com\/.*\.json/,
      "handler": "networkFirst"
    },

    /**
     * Use the "cache-first" strategy for mp3. This means that once an image is
     * cached, it will not be updated and waste the user's data. To update the image,
     * you would need to revision the image (e.g. by changing the filename).
     *
     * Cross-origin requests will always return a status of 0 - this needs to be
     * explicitly specified as cacheable when creating the handler.
     */
    {
      "urlPattern": /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/audiostream-89853\.appspot\.com\/o\//,
      "handler": "cacheFirst",
      "options": {
        "cacheName": 'cache-mp3',
        "cacheableResponse": {
          "statuses": []
        }
      },
    }
  ]
};
