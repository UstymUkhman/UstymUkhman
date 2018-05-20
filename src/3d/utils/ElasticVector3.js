export default class ElasticVector3 {
  constructor (value) {
    this.value = value
    this.x = value.x
    this.y = value.y
    this.z = value.z
    this.speed = 3
  }

  update (delta) {
    // delta = Math.min(delta, 1 / 20);

    let distx = this.x - this.value.x
    let disty = this.y - this.value.y
    let distz = this.z - this.value.z

    this.value.x += distx * (this.speed * delta)
    this.value.y += disty * (this.speed * delta)
    this.value.z += distz * (this.speed * delta)
  }
}
