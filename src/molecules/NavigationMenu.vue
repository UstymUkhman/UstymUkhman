<template>
  <ul>
    <!-- NOTE: This is an hyper-simplified navigation menu -->
    <li class="nav" v-for="route in routes" :key="route.name">
      <router-link exact :to="{name: route, params: {language:$language.current}}">{{ route }}</router-link>
    </li>
  </ul>
</template>

<script>
import appRoutes from '@/routes-multilanguage'

export default {
  name: 'NavigationMenu',

  methods: {
    mapRoute: function (r, to) {
      r.forEach((route) => {
        if (route.name) {
          to.push(route.name)
        }
        if (route.children) {
          this.mapRoute(route.children, to)
        }
      })
    }
  },

  computed: {
    routes: function () {
      let routes = []
      this.mapRoute(appRoutes, routes)
      return routes
    }
  },

  mounted () {
    const rand = Math.random()

    console.log(`Random Number: ${rand}`)
  }
}
</script>

<style scoped lang="scss">
@import 'app-colors';

li {
  display: inline-block;
  padding: 0.5rem;
}

a {
  transition: color 0.5s;
}

.router-link-active {
  color: $c-aqua;
}

</style>
