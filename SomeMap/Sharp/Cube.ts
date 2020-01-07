import Base, { BaseOption, Perspective, BaseTodo, Pos, MapMouseEvent, Vi } from './Base'
import { animate as _animate } from '../utils/animate'
import { setOption, changeFaceColor } from '../utils/utils'

export interface CubeOption extends BaseOption {
  x: number
  y: number
  z: number
  pos: Pos
  theta?: number
  radius?: number
  cubeWidth?: number
  cubeHeight?: number
  cubeLength?: number
  faceColor?: Color
  text?: string
}

export interface CubeSetOption {
  theta?: number
  perspective?: Perspective
  faceColor?: FaceColor
  clicked?: boolean
}

export interface CubeBackState {
  attr: CubeSetOption
  state: {
    [index: string]: any
  }
}

export interface CubeAnimationOption extends CubeSetOption {
  x?: number
  y?: number
  z?: number
}

export interface FaceColor {
  [index: number]: Color
}

enum rgba {
  red = 0,
  green,
  blue,
  alpha
}
export interface RGBA extends Array<number | undefined> {
  [rgba.red]: number
  [rgba.green]: number
  [rgba.blue]: number
  [rgba.alpha]?: number
}

enum hlsa {
  hue = 0,
  saturation,
  lightness,
  alpha
}
export interface HSLA extends Array<number | string | undefined> {
  [hlsa.hue]: number
  [hlsa.saturation]: string
  [hlsa.lightness]: string
  [hlsa.alpha]?: number
}

export type Color = HSLA | RGBA
export type ColorValue = number | string

const isString = (s: any) => typeof s === 'string'
const c2s = (type: string, c: Color) => `${type}(${c.join(',')})`
const c2type = (c: Color) => isString(c[1]) && isString(c[2]) ? c[3] ? 'hsla' : 'hsl'
  : c[3] ? 'rgba' : 'rgb'
export const toColor = (c: Color | string) => typeof c === 'string' ? c : c2s(c2type(c), c)



const checkVi = (e: number, offset: number) => e !== undefined ? e : (Math.random() - 0.5) * offset
export const CUBE_LINES = [[0, 1], [1, 3], [3, 2], [2, 0], [2, 6], [3, 7], [0, 4], [1, 5], [6, 7], [6, 4], [7, 5], [4, 5]]
export const CUBE_FACE = [[0, 1, 3, 2], [0, 1, 5, 4], [3, 2, 6, 7], [4, 5, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]]
export const CUBE_VERTICES = [[-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1], [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1]]

class Cube extends Base {
  width: number
  length: number
  height: number
  faces: Path2D[] = []
  faceColor: FaceColor = {
    0: [48, 48, 48, 0.75],
    1: [200, 32, 32, 0.9],
    2: [41, 41, 41, 0.9]
  }
  todo: BaseTodo = {}
  pos: Pos
  strokeStyle: string = 'rgb(64, 170, 191, 0.5)'
  backUpAttr: CubeBackState = {
    attr: {},
    state: {}
  }
  text: string = ''

  constructor(cubeOption: CubeOption) {
    super(cubeOption)

    const { cubeLength, cubeWidth, cubeHeight, canvasWidth, canvasHeight, x, y, z, radius, theta, faceColor, pos } = cubeOption
    this.radius = radius || Math.floor(Math.random() * 12 + 10)
    this.pos = pos
    this.width = cubeWidth || this.radius
    this.height = cubeHeight || radius || 10
    this.length = cubeLength || this.radius
    if (cubeOption.text)
      this.text = cubeOption.text

    this.x = checkVi(x, canvasWidth)
    this.y = checkVi(y, canvasHeight)
    this.z = checkVi(z, canvasHeight)

    if (faceColor) this.faceColor[1] = faceColor

    this.theta = theta || 0

    this.ctx.lineJoin = 'round'
    this.ctx.lineWidth = 2
    this.on('click', changeFaceColor())

  }

  restore() {
    setOption({ ...this.backUpAttr.attr }, this)
    setOption({ changed: false }, this.backUpAttr.state)
  }


  set(opt: CubeSetOption) {
    setOption(opt, this)
  }

  pointInPath(evt: { x: number, y: number, type: string }) {
    const hit = this.faces.some(e => this.ctx.isPointInPath(e, evt.x, evt.y))
    if (hit) {
      this.todo[evt.type] && this.todo[evt.type].forEach(e => e.call(this, this, this.father))
      return hit
    } else return false
  }

  on(type: keyof GlobalEventHandlersEventMap, todo: Function) {
    if (!this.todo[type]) this.todo[type] = []
    this.todo[type].push(todo)
  }

  animate(opt: CubeAnimationOption) {
    _animate(this, 10000, opt)
  }

  // Do some math to project the 3D position into the 2D canvas
  viToXy([x, y, z]: number[]) {
    const trans = ({ x, y, z }: Vi): Vi => ({
      x: x,
      y: y * Math.cos(this.theta) + z * Math.sin(this.theta),
      z: y * Math.sin(this.theta) + z * Math.cos(this.theta)
    })

    const temp = {
      x: this.x + this.width * x,
      z: this.z + this.length * z,
      y: this.y + this.height * y,
    }
    return this.project(trans(temp), this.perspective)
  }

  drawFace(index: number = 1) {
    const path = new Path2D()
    const ctx = this.ctx
    CUBE_FACE[index].forEach((e, i) => {
      const { x, y } = this.viToXy(CUBE_VERTICES[e])
      if (i === 0) path.moveTo(x, y)
      else path.lineTo(x, y)
    })
    path.closePath()
    const color = this.faceColor[index] || this.faceColor[0]
    ctx.fillStyle = toColor(color)
    ctx.fill(path)

    if (index === 1) {
      // todo feat mobile font-size
      const { x, y } = this.viToXy([1, -1, 0])

      let text = this.pos.x === 0 ? this.pos.y :
        this.pos.y === 0 ? this.pos.x : this.text
      // if(this.pos.x === 0 || this.pos.y === 0) text = this.pos.x ||

      ctx.font = `${this.text.length > 3 ? this.radius / 3 : this.radius / 2}px sans-serif`
      ctx.fillStyle = '#313131'
      ctx.textAlign = 'right'
      ctx.fillText(text + ' ', x, y)
    }

    ctx.restore()
    if (index === 0 || index === 1) this.faces[index] = path
  }

  draw() {

    const ctx = this.ctx
    // Do not render a cube that is in front of the camera
    if (this.z < -this.perspective.PERSPECTIVE + this.radius) {
      return
    }


    CUBE_LINES.forEach((line, index) => {
      if (index === 2 || index === 8) return
      // if (index < 5) return
      const v1Project = this.viToXy(CUBE_VERTICES[line[0]])
      const v2Project = this.viToXy(CUBE_VERTICES[line[1]])

      this.ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(v1Project.x, v1Project.y)
      ctx.lineTo(v2Project.x, v2Project.y)
      this.ctx.strokeStyle = this.strokeStyle
      ctx.stroke()
    })

    // ? 左右
    // this.drawFace(5)
    // this.drawFace(4)
    this.drawFace(0)
    this.drawFace(1)
  }
}

export default Cube
