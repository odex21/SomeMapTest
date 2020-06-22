import { SomeMap } from '../SomeMap'
import Cube, { RGBA, HSLA, Color, ColorValue } from '../Sharp/Cube'
import { Pos } from '../Sharp/Base'
import { Options, P, GradientParm } from '.'

const setOption = (option: Options, target: any) => {
  Object.keys(option).forEach(e => {
    if (option[e] !== undefined)
      target[e] = typeof option[e] === 'object' ? Object.assign(target[e] || {}, option[e]) : option[e]
  })
}


const mutiRadio = (s: number | string, radio: number) => typeof s === 'number' ? s * radio : +s.slice(0, -1) * radio + s.slice(-1)
const deepColor = (raw: Color, radio: number): Color => (<any>raw).map((e: ColorValue) => mutiRadio(e, radio))

const changeFaceColor = (color?: Color) => (cube: Cube, context: SomeMap) => {
  if (!cube.backUpAttr.state.changed) {
    setOption({ faceColor: cube.faceColor }, cube.backUpAttr.attr)
    setOption({ changed: true }, cube.backUpAttr.state)
    cube.faceColor[1] = color || deepColor(cube.faceColor[1], 1.5)
  } else {
    cube.restore()
  }
  cube.update()
}

const sleep = (time: number) => new Promise((resolve, reject) => {
  setTimeout(() => resolve(), time)
})


const changeXZ = (width: number, height: number, r: number, xOffset: number, yOffset: number) => ({ x, y }: Pos): Pos => ({
  x: (x - (width / 2) + xOffset) * r,
  y: (y - (height / 2) + yOffset) * r,
})

const gradient = (ctx: CanvasRenderingContext2D, { vector, colors }: GradientParm) => {
  const { p1, p2 } = vector
  const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
  colors.forEach(({ color, p }) => {
    gradient.addColorStop(p, color)
  })
  return gradient
}


class TaskQueue {
  concurrency: number
  running: number
  queue: P[]
  finalTask: Function

  constructor(concurrency: number = 1, finalTask = () => { }, queue: P[] = []) {
    this.concurrency = concurrency
    this.running = 0
    this.queue = queue
    this.finalTask = finalTask

    return this
  }

  pushTask(task: P) {
    this.queue.push(task)
    this.next()
  }

  clear() {
    this.queue = []
  }

  next() {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift() as P
      task().then(() => {
        this.running--
        this.next()
      })
      this.running++
    }
    if (this.running === 0 && this.queue.length === 0) {
      this.finalTask()
    }
  }
}

const arrangeCube = (arr: Cube[], defaultX: number) => {
  const res: Cube[] = []
  let temp1: Cube[] = [], temp2: Cube[] = []

  let curY: number
  arr.forEach((el) => {
    const { x, y } = el.pos
    if (curY === undefined) curY = y

    if (y !== curY) {
      curY = y
      res.push(...temp1.reverse(), ...temp2)
      temp1 = []
      temp2 = []
    }
    if (x < defaultX / 2) temp2.push(el)
    else temp1.push(el)
  })

  // res.push(...temp1, ...temp2.reverse())
  res.push(...temp2, ...temp1.reverse())

  return res
}

const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resovle) => {
  const img = new Image()
  img.src = src
  img.onload = () => resovle(img)
})

export {
  setOption,
  changeFaceColor,
  sleep,
  TaskQueue,
  arrangeCube,
  changeXZ,
  gradient,
  loadImage
}
