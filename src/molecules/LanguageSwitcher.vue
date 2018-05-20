<template>
  <div>
    <span v-translate translate-comment="language switcher label" >Language:</span>
    <select @change="onChange" name="language" v-model="$language.current">
      <option v-for="(language, key) in $language.available" :value="key" :key="key">{{ language }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'LanguageSwitcher',
  methods: {
    onChange: function () {
      this.$emit('change', this.$language.current)
    }
  }
}
</script>
