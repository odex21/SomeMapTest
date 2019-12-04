
class Base {
  x: number
  y: number
  z: number
  theta: number
  phi: number
  radius: number
  globalRadius: number
  canvasWidth: number
  canvasHeight: number
  xProjected: number
  yProjected: number
  scaleProjected: number
  ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D, { canvasWidth, canvasHeight }: BaseOption) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.ctx = ctx
    this.x = (Math.random() - 0.5) * canvasWidth // Give a random x position
    this.y = (Math.random() - 0.5) * canvasHeight // Give a random y position
    this.z = Math.random() * canvasWidth // Give a random z position
    this.radius = 10 // Size of our element in the 3D world
    this.globalRadius = this.canvasWidth / 3

    this.theta = Math.random() * 2 * Math.PI // Random value between [0, 2Pi]
    this.phi = Math.acos((Math.random() * 2) - 1) // Random value between [0, Pi]

    this.xProjected = 0 // x coordinate on the 2D world
    this.yProjected = 0 // y coordinate on the 2D world
    this.scaleProjected = 0 // Scale of the element on the 2D world (further = smaller)
    // animate(this, 10000, { z: -20 })
  }
}

export default Base
