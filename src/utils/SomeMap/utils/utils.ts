import SomeMap from '..'
import Cube from '../Sharp/Cube'
import { Pos } from '../Sharp'
import { Options, P, GradientParm } from '.'

const setOption = (option: Options, target: any) => {
  Object.keys(option).forEach(e => {
    if (option[e] !== undefined)
      target[e] = typeof option[e] === 'object' ? Object.assign(target[e] || {}, option[e]) : option[e]
  })
}

const changeFaceColor = (color: string = 'rgba(0, 255, 0, 1)') => (cube: Cube, context: SomeMap) => {
  if (!cube.backUpAttr.state.clicked) {
    setOption({ faceColor: cube.faceColor }, cube.backUpAttr.attr)
    setOption({ clicked: true }, cube.backUpAttr.state)
    cube.faceColor[1] = color
  } else {
    setOption({ ...cube.backUpAttr.attr }, cube)
    setOption({ clicked: false }, cube.backUpAttr.state)
  }
  context.draw()
}

const sleep = (time: number) => new Promise((resolve, reject) => {
  setTimeout(() => resolve(), time)
})


const changeXZ = (width: number, height: number, r: number, xOffset: number, yOffset: number) => ({ x, y }: Pos): Pos => ({
  x: (x - (width / 2) + xOffset) * r,
  y: (y - (height / 2) + yOffset) * r,
})

const gradient = (ctx: CanvasRenderingContext2D, { p1, p2, colors = [{ color: 'green', p: 0 }, { color: 'blue', p: 1 }] }: GradientParm) => {
  const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
  colors
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

  constructor(concurrency: number, finalTask = () => { }, queue = []) {
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
      console.log('Task is over')
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

export {
  setOption,
  changeFaceColor,
  sleep,
  TaskQueue,
  arrangeCube,
  changeXZ,
  gradient
}
