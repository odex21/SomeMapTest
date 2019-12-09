import Line from "./Line"
import { PathLineOption } from '.'
import { GradientColor } from '../utils'
import { gradient } from '../utils/utils'

class PathLine extends Line {
  private _gradientColors: GradientColor[] = [{ color: 'rgba(0, 0, 0, 0)', p: 0 }, { color: 'rgba(0, 0, 0, 0)', p: 1 }]
  run: boolean = true
  time: number
  color: number

  constructor(opt: PathLineOption) {
    super(opt)
    this.gradientColors = opt.gradientColors //|| this._gradientColors
    this.time = opt.time || 2000
    this.color = Math.random() * 360
    // this.strokeStyle = 'rgba(0, 0, 0, 0)'
  }

  update() {
    this.father.draw(false)
  }

  animate(time: number = this.time, color: number = this.color) {
    // console.log(time, color)
    return new Promise((resolve, reject) => {
      let start: number, saveTime: number = 0
      const auto = (timeStamp: number) => {
        if (!start) start = timeStamp
        const progress = timeStamp - start + saveTime
        if (!this.run) {
          resolve(progress)
          return
        }

        let q = 0
        let p = Math.min(progress / time, 1)
        if (p > 0.618) {
          q = 1 - (1 - p) / 0.382
        }
        p = Math.min(p / 0.7, 1)
        const colors = [
          { p: 0, color: `hsla(${color}, 100%, 50%, 0.1)` },
          { p: q, color: `hsla(${color}, 100%, 50%, 0.7)` },
          { p: p, color: `hsla(${color}, 100%, 35%, 1)` },
          { p: Math.min(p + 0.02, 1), color: `hsla(${color}, 100%, 50%, 0)` },
        ]
        this.gradientColors = colors
        this.update()

        if (progress < time) {
          requestAnimationFrame(auto)
        } else {
          resolve()
        }

      }

      requestAnimationFrame(auto)
    })

  }

  set strokeStyle(set) { }
  get strokeStyle() {
    const xyArr = this.absPath
    if (xyArr.length === 0) return '？？？？？？？'
    return gradient(this.ctx, {
      vector: { p1: xyArr[0], p2: xyArr[this.points.length - 1] },
      colors: this.gradientColors
    })

  }

  set gradientColors(colors: GradientColor[]) {
    this._gradientColors = colors
  }

  get gradientColors() {
    return this._gradientColors
  }
}

export default PathLine
