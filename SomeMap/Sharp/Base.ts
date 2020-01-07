import SomeMap from '..'

export interface BaseOption {
  ctx: CanvasRenderingContext2D
  father: SomeMap
  canvasWidth: number
  canvasHeight: number
}

export interface Vi {
  x: number,
  y: number,
  z: number
}

export interface Perspective {
  PERSPECTIVE: number
  PROJECTION_CENTER_X: number
  PROJECTION_CENTER_Y: number
}

export interface Pos {
  x: number
  y: number
}

export type LinePoint = Pos

export interface Evt {
  x: number
  y: number
}

export interface BaseTodo {
  [index: string]: Function[]
}

export interface MapMouseEvent extends MouseEvent {
  layerX: number
  layerY: number
}


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
  perspective: Perspective = {
    PERSPECTIVE: this.canvasWidth * 0.8 || 1000,
    PROJECTION_CENTER_X: this.canvasWidth / 2 || 500,
    PROJECTION_CENTER_Y: this.canvasHeight / 2 || 500
  }

  constructor({ canvasWidth, canvasHeight, father, ctx }: BaseOption) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight

    this.father = father
    this.ctx = ctx

    this.x = 0//(Math.random() - 0.5) * canvasWidth // Give a random x position
    this.y = 0//(Math.random() - 0.5) * canvasHeight // Give a random y position
    this.z = 0//Math.random() * canvasWidth // Give a random z position
    this.theta = 0// Math.random() * 2 * Math.PI // Random value between [0, 2Pi]
    this.phi = 0//Math.acos((Math.random() * 2) - 1) // Random value between [0, Pi]


    this.radius = 10 // Size of our element in the 3D world
    this.globalRadius = this.canvasWidth / 3

    this.xProjected = 0 // x coordinate on the 2D world
    this.yProjected = 0 // y coordinate on the 2D world
    this.scaleProjected = 0 // Scale of the element on the 2D world (further = smaller)
  }

  project({ x, y, z }: Vi, { PERSPECTIVE, PROJECTION_CENTER_X, PROJECTION_CENTER_Y }: Perspective) {
    const sizeProjection = PERSPECTIVE / (PERSPECTIVE + y)
    const xProject = (x * sizeProjection) + PROJECTION_CENTER_X
    const yProject = (z * sizeProjection) + PROJECTION_CENTER_Y
    return {
      size: sizeProjection,
      x: xProject,
      y: yProject
    }
  }

  update() {
    this.father && this.father.draw(true)
  }
}

export default Base
