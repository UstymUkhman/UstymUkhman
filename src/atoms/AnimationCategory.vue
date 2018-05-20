<template>
  <h2>{{ name }}</h2>
</template>

<script>
export default {
  name: 'AnimationCategory',

  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
@import 'app-colors';

h2 {
  font-family: 'Raleway', Verdana, sans-serif;
  font-weight: 200;
  font-size: 40px;

  border-bottom: solid 1px $silver;
  padding-bottom: 10px;
  margin: 0 auto 50px;
  display: table;

  text-decoration: none;
  letter-spacing: 3px;
  text-align: center;
  color: $silver;
}
</style>
