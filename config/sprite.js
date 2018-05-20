var path = require('path')

module.exports = {
  src: {
    cwd: path.resolve(__dirname, '../sprites'),
    glob: '*.png'
  },
  target: {
    image: path.resolve(__dirname, '../src/assets/img/sprite.png'),
    css: path.resolve(__dirname, '../src/_sprite.scss')
  },
  apiOptions: {
    cssImageRef: '~@/assets/img/sprite.png'
  }
}
