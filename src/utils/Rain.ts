export default class Rain {
  private readonly characters: number = 50
  private columns: number = 100

  constructor (columns = 100, characters = 50) {
    this.characters = characters
    this.columns = columns
  }

  public createRain (container: HTMLElement, name: string, dense: boolean = false): void {
    if (dense) this.columns *= 5

    for (let i = 0; i < this.columns; i++) {
      const column = document.createElement('p')
      const size = this.createCharCodes(column, dense)

      column.className = `${name}-column column-size-${size} code-${i} ${dense ? 'dense' : ''}`
      container.appendChild(column)
    }
  }

  private createCharCodes (drop: HTMLElement, small = false): number {
    let size = Math.floor(Math.random() * 13)
    const codes = this.getCharCodes()

    if (small) {
      if (size < 10) size = 20
      else if (size < 12) size = 8
      else size = 40
    } else {
      if (size < 10) size = 25
      else if (size < 12) size = 12
      else size = 60
    }

    this.setCharCodes(drop, codes, size)
    return size
  }

  private getCharCodes (): string[] {
    return Array.from(
      new Array(this.characters), () => {
        return String.fromCharCode(this.getCharCode())
      }
    )
  }

  private getCharCode (): number {
    const code = Math.floor(Math.random() * 94 + 33)
    return (code === 64) ? 47 : code
  }

  private setCharCodes (column: HTMLElement, codes: string[], size: number): void {
    codes.forEach((code, index) => {
      const char = document.createElement('span')
      char.className = `char-${index} code-size-${size}`

      char.textContent = code
      column.appendChild(char)
    })
  }
}
