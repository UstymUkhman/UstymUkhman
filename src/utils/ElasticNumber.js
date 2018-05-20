export default class ElasticNumber {
  constructor (value) {
    this.value = value
    this.target = value
    this.speed = 3
  }

  update (delta) {
    // delta = Math.min(delta, 1 / 20);

    let dist = this.target - this.value

    this.value += dist * (this.speed * delta)
  }
}
