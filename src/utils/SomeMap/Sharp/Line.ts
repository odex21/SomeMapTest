import Base from "./Base"
import { LineOption, LinePoint, Vi, Pos, CubeSetOption, Perspective } from '.'
import { setOption, gradient } from '../utils/utils'


class Line extends Base {
  points: Pos[]
  absPath: Pos[] = []
  width: number
  strokeStyle: string | CanvasGradient = 'red'
  path: Path2D = new Path2D()

  constructor(opt: LineOption) {
    super(opt)
    this.points = opt.points
    this.x = 0
    this.y = opt.y || 20
    this.z = 0
    this.width = opt.width || 5

    this.draw()
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
    return path
  }

  draw() {
    this.ctx.lineWidth = this.width
    this.ctx.save()

    this.ctx.strokeStyle = this.strokeStyle
    this.ctx.stroke(this.init())

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
