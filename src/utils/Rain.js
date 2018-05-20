export default class Rain {
  constructor (columns = 100, characters = 50) {
    this.characters = characters
    this.columns = columns
  }

  createRain (container, name) {
    for (let i = 0; i < this.columns; i++) {
      const column = document.createElement('p')
      const size = this.createCharCodes(column)

      column.className = `${name}-column column-size-${size} code-${i}`
      container.appendChild(column)
    }
  }

  createCharCodes (drop) {
    let size = Math.floor(Math.random() * 13)
    const codes = this.getCharCodes()

    if (size < 10) size = 25
    else if (size < 12) size = 12
    else size = 60

    this.setCharCodes(drop, codes, size)
    return size
  }

  getCharCodes () {
    return Array.from(
      new Array(this.characters), () => {
        return String.fromCharCode(this.getCharCode())
      }
    )
  }

  getCharCode () {
    const code = Math.floor(Math.random() * 94 + 33)
    return (code === 64) ? 47 : code
  }

  setCharCodes (column, codes, size) {
    codes.forEach((code, index) => {
      const char = document.createElement('span')

      char.className = `char-${index} code-size-${size}`
      char.textContent = code

      column.appendChild(char)
    })
  }
}
