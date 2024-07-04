// Create a new file in /plugins/matomo.js

import Vue from 'vue'
import VueMatomo from 'vue-matomo'

Vue.use(VueMatomo, {
  host: 'https://jovylle.matomo.cloud/', // Replace with your Matomo host URL
  siteId: 1 // Replace with your Matomo site ID
})
