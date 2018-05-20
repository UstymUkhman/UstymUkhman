import Vue from 'vue'
import GetTextPlugin from 'vue-gettext'

import availableLanguages from '@/assets/data/availableLanguages.json'

// only one translation, add another one if you have another
import it from '@/assets/data/locale/it/translation.json'

// usage: https://github.com/Polyconseil/vue-gettext
Vue.use(GetTextPlugin, {
  translations: Object.assign({}, it),
  // use this line to join locales together
  // translations: Object.assign({}, it, zh, es, etc),
  availableLanguages: availableLanguages,
  defaultLanguage: 'en',
  silent: true
})
