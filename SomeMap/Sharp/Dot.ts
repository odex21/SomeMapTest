import { animate } from '../utils/animate'
import { BaseOption } from './Base'

const element = ['🦖', '🦕', '🐙', "🦑", '🦐', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈']

class Dot {
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
    this.phi = Math.acos((Math.random() * 1) - 1) // Random value between [0, Pi]

    this.xProjected = 0 // x coordinate on the 2D world
    this.yProjected = 0 // y coordinate on the 2D world
    this.scaleProjected = 0 // Scale of the element on the 2D world (further = smaller)
    // animate(this, 10000, { z: -20 })
    animate(this, 10000, { theta: this.theta + Math.PI * 2 })
    // animate(this, 10000, { theta: this.phi + Math.acos(-1) })
  }
  // Project our element from its 3D world to the 2D canvas
  project(PERSPECTIVE: number, PROJECTION_CENTER_X: number, PROJECTION_CENTER_Y: number) {
    // // The scaleProjected will store the scale of the element based on its distance from the 'camera'
    // this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);
    // // The xProjected is the x position on the 2D world
    // this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X;
    // // The yProjected is the y position on the 2D world
    // this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y;


    this.y = this.globalRadius * Math.sin(this.phi) * Math.cos(this.theta)
    this.x = this.globalRadius * Math.cos(this.phi)
    this.z = this.globalRadius * Math.sin(this.phi) * Math.sin(this.theta) + this.globalRadius

    // Project the 3D coordinates to the 2D canvas
    this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z)
    this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X
    this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y
  }
  // Draw the dot on the canvas
  draw(p: number, px: number, py: number) {
    // We first calculate the projected values of our dot
    this.project(p, px, py)
    // We define the opacity of our element based on its distance
    this.ctx.globalAlpha = Math.abs(1 - this.z / this.canvasWidth)
    // We draw a rectangle based on the projected coordinates and scale
    // this.ctx.fillRect(this.xProjected - this.radius, this.yProjected - this.radius, this.radius * 2 * this.scaleProjected, this.radius * 2 * this.scaleProjected);


    // In this case we are drawing a circle instead of a rectangle
    this.ctx.beginPath()

    // The arc function takes 5 parameters (x, y, radius, angle start, angle end) 
    this.ctx.arc(this.xProjected, this.yProjected, this.radius * this.scaleProjected, 0, Math.PI * 2)
    // Fill the circle in black
    this.ctx.fill()
  }
}

export default Dot
