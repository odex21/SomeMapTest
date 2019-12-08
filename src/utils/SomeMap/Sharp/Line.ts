import Base from "./Base"
import { LineOption, LinePoint, Vi, Pos, CubeSetOption, Perspective } from '.'
import { setOption, gradient } from '../utils/utils'


class Line extends Base {
  points: Pos[]
  width: number

  constructor(opt: LineOption) {
    super(opt)
    // const { x, y, z } = opt
    this.points = opt.points
    this.draw()
    this.x = 0
    this.y = opt.y || 20
    this.z = 0
    this.width = opt.width || 5
  }


  set(opt: CubeSetOption) {
    setOption(opt, this)
  }

  draw() {
    this.ctx.lineWidth = this.width
    const arr = this.points
    this.ctx.save()
    const path = new Path2D()

    const xyArr = arr.map(e => this.viToXy(e))
    this.ctx.strokeStyle = gradient(this.ctx, { p1: xyArr[0], p2: xyArr[arr.length - 1] })

    xyArr.forEach(({ x, y }, i) => {
      if (i === 0) path.moveTo(x, y)
      else path.lineTo(x, y)
    })

    this.ctx.stroke(path)
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
