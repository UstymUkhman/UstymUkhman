<template>
  <!-- NOTE: this is not translated -->
  <article class="service-page">
    <div class="quotes-interface" :class="{ active: !quotes.loading}">
      <h1>Chuck Norris Service</h1>
      <div class="ui">
        <h2>Get random quote</h2>
        <button @click="getRandomQuote">Get Random Quote</button>
      </div>

      <div class="ui">
        <h2>Get random quote by category</h2>
        <select v-model="selectedCategory">
          <option v-for="category in quotes.categories" :value="category" :key="category">{{ category }}</option>
        </select>
        <button @click="getQuoteByCategory">Go!</button>
      </div>

      <div class="ui">
        <h2>Search Quotes</h2>
        <input v-model="searchString" />
        <button @click="searchQuote">Go!</button>
      </div>

      <div v-if="quotes.result && !quotes.loading" class="ui">
        <p class="result" v-for="quote in quotes.result" :key="quote">{{quote}}</p>
      </div>

      <Spinner class="loading" color="#ffffff" v-if="quotes.loading"></Spinner>

    </div>
  </article>
</template>

<script>
import ExampleRestApi from '@/services/ExampleRestApi'
import Spinner from 'vue-spinner/src/ScaleLoader.vue'
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'

export default {
  name: 'Service',

  mixins: [FirePrerenderEvent],

  components: {
    Spinner
  },

  data: function () {
    return {
      quotes: {},
      selectedCategory: null,
      searchString: null
    }
  },

  mounted: function () {
    ExampleRestApi.setModel(this.quotes)
    ExampleRestApi.getCategories()
  },

  methods: {
    getRandomQuote: function () {
      ExampleRestApi.getRandomQuote()
    },
    getQuoteByCategory: function () {
      ExampleRestApi.getCategoryQuote(this.selectedCategory)
    },
    searchQuote: function () {
      ExampleRestApi.search(this.searchString)
    }
  },

  metaInfo: function () {
    return {
      // service page title in the browser
      title: this.$gettext('Service Page')
    }
  }
}
</script>

<style scoped lang="scss">
@import 'app-colors';
@import 'mixins';

.service-page {
  text-align: center;
}

.quotes-interface {
  padding: 20px;

  &.active {
    .ui {
      opacity: 1;
      pointer-events: initial;
    }
  }
}
.ui {
  opacity: 0.1;
  pointer-events: none;
  transition: opacity 0.5s;
  padding: 10px;
}

.result {
  background-color: color-alpha($c-black, 0.7);
  color: $c-white;
  padding: 10px;
  margin: 10px;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>
