let isPlainObject = function (o) {
  return o && (typeof o === 'object') && o.constructor === Object
}

export { isPlainObject }
