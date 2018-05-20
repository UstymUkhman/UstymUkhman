import axios from 'axios'
import Vue from 'vue'
import to from 'await-to-js'

class ExampleRestApi {
  constructor () {
    this._randomQuote = {
      url: 'https://api.chucknorris.io/jokes/random'
    }
    this._categoryQuote = {
      url: 'https://api.chucknorris.io/jokes/random'
    }
    this._categories = {
      url: 'https://api.chucknorris.io/jokes/categories'
    }
    this._search = {
      url: 'https://api.chucknorris.io/jokes/search'
    }
  }

  setModel (model) {
    this.model = model
    Vue.set(this.model, 'loading', false)
    Vue.set(this.model, 'result', null)
    Vue.set(this.model, 'categories', null)
  }

  async getRandomQuote () {
    Vue.set(this.model, 'loading', true)
    let [error, response] = await to(axios.request(this._randomQuote))
    if (!error) {
      Vue.set(this.model, 'result', [response.data.value])
    }
    Vue.set(this.model, 'loading', false)
  }

  async getCategoryQuote (category) {
    Vue.set(this.model, 'loading', true)
    let [error, response] = await to(axios.request(Object.assign(this._randomQuote, {params: { category: category }})))
    if (!error) {
      Vue.set(this.model, 'result', [response.data.value])
    }
    Vue.set(this.model, 'loading', false)
  }

  async getCategories () {
    Vue.set(this.model, 'loading', true)
    let [error, response] = await to(axios.request(this._categories))
    if (!error) {
      Vue.set(this.model, 'categories', response.data)
    }
    Vue.set(this.model, 'loading', false)
  }

  async search (query) {
    Vue.set(this.model, 'loading', true)
    let [error, response] = await to(axios.request(Object.assign(this._search, {params: { query: query }})))
    if (!error) {
      let result = []
      if (response.data.result) {
        response.data.result.forEach(quote => {
          result.push(quote.value)
        })
      }
      Vue.set(this.model, 'result', result)
    }
    Vue.set(this.model, 'loading', false)
  }
}

export default new ExampleRestApi()
