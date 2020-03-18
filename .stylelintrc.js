"use strict";

module.exports = {
  processors: ["@mapbox/stylelint-processor-arbitrary-tags"],
  extends: "stylelint-config-sass-guidelines",
  plugins: ["stylelint-scss"],

  rules: {
    "scss/dollar-variable-colon-space-before": null,
    "scss/dollar-variable-colon-space-after": null,
    "order/properties-alphabetical-order": null,
    "scss/dollar-variable-pattern": null,
    "selector-no-qualifying-type": null,
    "function-comma-space-after": null,
    "number-no-trailing-zeros": null,
    "rule-empty-line-before": null,
    "length-zero-no-unit": null,
    "max-nesting-depth": 3,
    "order/order": null
  }
};
