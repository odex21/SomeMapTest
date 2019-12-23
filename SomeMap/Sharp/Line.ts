import Base, { BaseOption, LinePoint, Pos, Vi } from "./Base"
import { setOption, gradient } from '../utils/utils'
import { CubeSetOption } from './Cube'

export interface LineOption extends BaseOption {
  points: LinePoint[]
  r: number
  y?: number
  width?: number
}

class Line extends Base {
  points: Pos[]
  absPath: Pos[] = []
  width: number
  strokeStyle: string | CanvasGradient = 'rgba(0, 0, 0, 0)'
  path!: Path2D
  i: number = 0

  constructor(opt: LineOption) {
    super(opt)
    this.points = opt.points
    this.x = 0
    this.y = opt.y || 20
    this.z = 0
    this.width = opt.width || 5
  }


  set(opt: CubeSetOption) {
    setOption(opt, this)
  }

  init() {
    this.absPath = this.points.map(e => this.viToXy(e))
    const path = new Path2D()
    this.absPath.forEach(({ x, y }, i) => {
      if (i === 0) path.moveTo(x, y)
      else path.lineTo(x, y)
    })
    this.path = path
  }

  draw() {
    this.ctx.save()
    this.ctx.lineWidth = this.width
    this.init()
    this.ctx.lineCap = 'round'
    this.ctx.lineDashOffset = -this.i++
    // if (this.i > 16) this.i = 0
    // this.ctx.setLineDash([this.radius * 3.5, this.radius * 2])
    this.ctx.strokeStyle = this.strokeStyle
    this.ctx.stroke(this.path)

    this.ctx.restore()
  }

  viToXy({ x, y }: Pos) {
    const z = this.y

    const trans = ({ x, y, z }: Vi): Vi => ({
      x: x,
      z: y * Math.cos(this.theta) + z * Math.sin(this.theta),
      y: y * Math.sin(this.theta) + z * Math.cos(this.theta)
    })
    return this.project(trans({ x, z, y, }), this.perspective)
  }
}

export default Line
