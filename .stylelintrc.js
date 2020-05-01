'use strict'

module.exports = {
  root: true,
  extends: 'stylelint-config-standard',

  rules: {
    'block-closing-brace-newline-after': null,
    'declaration-empty-line-before': null,
    'selector-no-qualifying-type': null,
    'function-comma-space-after': null,
    'at-rule-empty-line-before': null,
    'number-no-trailing-zeros': null,
    'rule-empty-line-before': null,
    'length-zero-no-unit': null,
    'function-name-case': null,
    'max-nesting-depth': 3,

    'at-rule-no-unknown': [true, {
      ignoreAtRules: [
        'include', 'function', 'mixin', 'content', 'at-root',
        'for', 'if', 'else', 'each', 'return'
      ]
    }],

    'selector-pseudo-element-no-unknown': [true, {
      ignorePseudoElements: ['v-deep'],
    }],

    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: ['export'],
    }]
  }
};
