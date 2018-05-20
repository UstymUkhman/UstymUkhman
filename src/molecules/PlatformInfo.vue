<template>
  <div class="platform-info">
    <h2 class="platform-title" v-translate translate-comment="Platform Information component title">Platform Information</h2>

    <div v-for="(item, i) in classes" class="platform-row" :class="{alternate: i % 2 === 0}" :key="item">
      <div class="platform-column left" :class="{emphasis: item.indexOf('no-') === -1}">{{item.split('no-').join('')}}</div>
      <div class="platform-column right">{{item.indexOf('no-') === -1 ? '✔' : '✘'}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlatformInfo',
  computed: {
    classes: function () {
      return window.document.getElementById('html-element').className.trim().split(' ')
    }
  }
}
</script>

<style scoped lang="scss">
@import 'app-colors';
@import 'mixins';

.platform-info {
  display: table;
}

.platform-title {
  display: table-caption;
  text-transform: uppercase;
}
.platform-row {
  display: table-row;
  background-color: color-alpha($c-white, 0.2);
  &.alternate {
    background-color: color-alpha($c-white, 0.1);
  }

  &:hover {
    background-color: color-alpha($c-white, 0.3);
  }
}

.platform-column {
  display: table-cell;
  padding: 0.2rem;

  &.emphasis {
    font-weight: 700;
  }
  &.left {
    text-align: right;
    width: 50%;
  }
  &.right {
    text-align: left;
    width: 50%;
  }
}

</style>
