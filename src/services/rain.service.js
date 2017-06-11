export class RainService {
  constructor() {
    this.setParams();
  }

  setParams(columns = 50, characters = 50) {
    this.characters = characters;
    this.columns    = columns;
  }

  createRain(container) {
    for (let i = 0; i < this.columns; i++) {
      let column = document.createElement('p'),
          size   = this.createCharCodes(column);

      column.className = `code-column column-size-${size} code-${i}`;
      container.appendChild(column);
    }
  }

  createCharCodes(drop) {
    let codes = this.getCharCodes(),
        size  = Math.floor(Math.random() * 13);

    if (size < 10) size = 25;
    else if (size < 12) size = 12;
    else size = 60;

    this.setCharCodes(drop, codes, size);
    return size;
  }

  getCharCodes() {
    return Array.from(
      new Array(this.characters), () => {
        return String.fromCharCode(this.getCharCode());
      }
    );
  }

  getCharCode() {
    let code = Math.floor(Math.random() * 94 + 33);
    return (code === 64) ? 47 : code;
  }

  setCharCodes(column, codes, size) {
    codes.forEach((code, index) => {
      let char = document.createElement('span');

      char.className = `char-${index} code-size-${size}`;
      char.textContent = code;

      column.appendChild(char);
    });
  }
}
