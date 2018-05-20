export default class ElasticVector2 {
  constructor (value) {
    this.value = value
    this.x = value.x
    this.y = value.y
    this.speed = 3
  }

  update (delta) {
    // delta = Math.min(delta, 1 / 20);

    let distx = this.x - this.value.x
    let disty = this.y - this.value.y

    this.value.x += distx * (this.speed * delta)
    this.value.y += disty * (this.speed * delta)
  }
}
