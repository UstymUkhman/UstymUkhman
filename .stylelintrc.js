"use strict"

module.exports = {
  extends: "stylelint-config-sass-guidelines",
  "processors": ["@mapbox/stylelint-processor-arbitrary-tags"],
  "plugins": [
    "stylelint-scss"
  ],
  rules: {
    "selector-no-qualifying-type": null,
    "number-no-trailing-zeros": null,
    "function-comma-space-after": null,
    "length-zero-no-unit": null,
    "rule-empty-line-before": null,
    "max-nesting-depth": 3,
    "order/properties-alphabetical-order": null,
    "order/order": null,
    "scss/dollar-variable-colon-space-after": null,
    "scss/dollar-variable-colon-space-before": null,
    "scss/dollar-variable-pattern": null
  }
}
