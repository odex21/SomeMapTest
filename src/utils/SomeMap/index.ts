
import Cube from './Sharp/Cube'
import { setOption, sleep, TaskQueue, arrangeCube, changeXZ } from './utils/utils'
import { tileInfo } from './data/tailInfo'
import { CubeSetOption, Pos } from './Sharp'
import Line from './Sharp/Line'



class SomeMap {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  canvasWidth: number
  canvasHeight: number
  dots: Cube[] = []
  PERSPECTIVE: number = 0
  PROJECTION_CENTER_X: number = 0
  PROJECTION_CENTER_Y: number = 0
  i: number = 0;
  theta: number = 0
  data = {
    width: 8,
    height: 4
  };
  baseFloor: Cube
  updateArr: Cube[] = []
  drawing: boolean = false
  baseOpt: any
  routes: Line[] = []
  r: number
  xz: (x: Pos) => Pos

  constructor(container: HTMLCanvasElement, theta: number = -75 / 360 * Math.PI, PERSPECTIVE: number, mapData: MapData) {
    this.canvas = container
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
    // this.context.clearRect(0, 0, width, height);
    const { width, height } = this.canvas
    this.canvasWidth = width
    this.canvasHeight = height
    this.r = Math.min(this.canvas.width / (mapData.width), this.canvas.height / (mapData.height))

    this.xz = changeXZ(mapData.width, mapData.height, this.r, 0.5, 0.5)
    console.log(width, height)

    this.baseOpt = {
      ctx: this.context,
      father: this,
      canvasWidth: width,
      canvasHeight: height,
    }

    const baseHeight = 2
    this.baseFloor = new Cube({
      ...this.baseOpt,
      x: 0,
      z: 0,
      y: baseHeight,
      cubeHeight: baseHeight,
      faceColor: '#414141',
      cubeLength: height / 2,
      cubeWidth: width / 2,
      pos: { x: 0, y: 0 }
    })

    this.init(mapData)

    const perspecOpt = { perspective: { PERSPECTIVE, PROJECTION_CENTER_X: width / 2, PROJECTION_CENTER_Y: height / 2 }, theta }
    this.setPerspective(perspecOpt)
    // this.baseFloor.set(perspecOpt)
    this.draw()

    this.canvas.addEventListener('click', (evt) => {
      for (let i = this.dots.length - 1; i > -1; i--) {
        const hit = this.dots[i].pointInPath(evt)
        if (hit) break
      }
    })
  }



  init(mapdata: MapData) {
    // test Path
    // this.addPath([{ x: 0, y: 0 }, { x: 11, y: 7 }])

    const r = this.r
    const { width, height } = mapdata
    const { width: canvasWidth, height: canvasHeight } = this.canvas

    console.log(width, height)

    const bottomHeight = r * 0.1
    const topHeight = r * 0.25

    for (let y = height - 1; y > -1; y--) {
      const top = []
      const bottom = []
      for (let x = width - 1; x > -1; x--) {
        const { x: w, y: h } = this.xz({ x, y })
        const baseOpt = {
          x: w,
          z: h,
          canvasWidth,
          canvasHeight,
          radius: r / 2,
          pos: { x: x, y: y },
          ctx: this.context,
          father: this,
        }

        const tile = mapdata.tiles[y * width + x]
        const target = tileInfo[tile.tileKey]
        const cubeHeight = (tile.heightType ? topHeight : bottomHeight) / 2

        const cube = new Cube({
          ...baseOpt,
          cubeHeight,
          y: tile.heightType ? -cubeHeight - bottomHeight : -cubeHeight,
          faceColor: target.color,
          tileInfo: target
        })

        if (tile.heightType) top.push(cube)
        else bottom.push(cube)
        if (tile.events)
          Object.entries(tile.events).forEach(([k, arr]) => {
            arr.forEach(e => {
              cube.on(k as keyof GlobalEventHandlersEventMap, e)
            })
          })
      }

      this.dots.push(...arrangeCube(bottom, width), ...arrangeCube(top, width))
    }
  }


  addPath(arr: Pos[]) {
    const pArr = arr.map(e => this.xz(e))
    const line = new Line({
      ...this.baseOpt,
      width: 10,
      y: -50,
      r: this.r,
      points: pArr
    })
    this.routes.push(line)
  }

  setPerspective(opt: CubeSetOption) {
    // todo update canvas width & height
    setOption(opt, this)
    this.dots.forEach(e => e.set(opt))
    this.routes.forEach(e => e.set(opt))
    this.baseFloor.set(opt)
    console.log(opt)
  }

  async draw() {
    if (this.drawing) {
      this.drawing = false
      await sleep(100)
    }
    this.drawing = true
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    const Queue = new TaskQueue(1, () => this.drawing = false)

    // Loop through the dots array and draw every dot

    Queue.pushTask(() => new Promise((resolve) => {
      this.baseFloor.draw()
      resolve()
    }))
    this.dots.forEach((e) => {
      Queue.pushTask(async () => {
        if (!this.drawing) {
          Queue.clear()
        }
        e.draw()
        // await sleep(80)
      })
    })

    this.routes.forEach(e => {
      Queue.pushTask(async () => {
        if (!this.drawing) {
          Queue.clear()
        }
        e.draw()
        // await sleep(80)
      })
    })
  }
}

export default SomeMap
