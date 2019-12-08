import SomeMap from '..'
import { BaseOption } from '.'

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
  father: SomeMap
  PROJECTION_CENTER_Y = this.canvasHeight / 2 || 500
  PROJECTION_CENTER_X = this.canvasWidth / 2 || 500
  PERSPECTIVE = this.canvasWidth * 0.8 || 1000;

  constructor({ canvasWidth, canvasHeight, father, ctx }: BaseOption) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight

    this.father = father
    this.ctx = ctx

    this.x = (Math.random() - 0.5) * canvasWidth // Give a random x position
    this.y = (Math.random() - 0.5) * canvasHeight // Give a random y position
    this.z = Math.random() * canvasWidth // Give a random z position
    this.theta = Math.random() * 2 * Math.PI // Random value between [0, 2Pi]
    this.phi = Math.acos((Math.random() * 2) - 1) // Random value between [0, Pi]


    this.radius = 10 // Size of our element in the 3D world
    this.globalRadius = this.canvasWidth / 3

    this.xProjected = 0 // x coordinate on the 2D world
    this.yProjected = 0 // y coordinate on the 2D world
    this.scaleProjected = 0 // Scale of the element on the 2D world (further = smaller)
    // animate(this, 10000, { z: -20 })
  }

}

export default Base
