
import Dot from './Sharp/Dot'
import Dot2 from './Sharp/Dot2'
import Cube from './Sharp/Cube'
import { setOption, changeToGreen, sleep, TaskQueue, arrangeCube, changeXZ } from './utils/utils'
// import testData from './data/mapdata.json'
import testData from './data/5-10mapdata.json'
const { mapData } = testData
import { tileInfo } from './data/tailInfo'
import { CubeSetOption, Pos } from './Sharp'
import Line from './Sharp/Line'

// // const width = 40, height = 30
// let PERSPECTIVE = width * 0.8; // The field of view of our 3D scene
// let PROJECTION_CENTER_X = width / 2; // x center of the canvas
// let PROJECTION_CENTER_Y = height / 2; // y center of the canvas



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

  constructor(container: HTMLCanvasElement, theta: number = -75 / 360 * Math.PI, PERSPECTIVE: number) {
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
      y: baseHeight / 2,
      cubeHeight: baseHeight,
      faceColor: '#414141',
      cubeLength: height / 2,
      cubeWidth: width / 2,
      pos: { x: 0, y: 0 }
    })

    this.init(mapData)

    const perspecOpt = { PERSPECTIVE, PROJECTION_CENTER_X: width / 2, PROJECTION_CENTER_Y: height / 2, theta }
    this.setPerspective(perspecOpt)
    this.baseFloor.set(perspecOpt)
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
    this.addPath([{ x: 0, y: 0 }, { x: 11, y: 7 }])

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

        // if (h === height || h === -1 || w === width || w === -1) {
        //   const cube = new Cube({
        //     ...baseOpt,
        //     y: -(bottomHeight) / 2,
        //     cubeHeight: bottomHeight,
        //     faceColor: 'rgb(230, 230, 230)',
        //   })
        //   // bottom.push(cube)
        //   continue
        // }

        const tile = mapData.tiles[y * width + x]
        const target = tileInfo[tile.tileKey]
        const random = tile.heightType ? topHeight : bottomHeight

        const cube = new Cube({
          ...baseOpt,
          y: -(tile.heightType ? random + bottomHeight : random),
          cubeHeight: random,
          faceColor: target.color,
        })

        if (tile.heightType) top.push(cube)
        else bottom.push(cube)

        cube.on('click', changeToGreen)
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
    const { PERSPECTIVE, PROJECTION_CENTER_X, PROJECTION_CENTER_Y, theta } = opt
    const temp = { PERSPECTIVE, PROJECTION_CENTER_X, PROJECTION_CENTER_Y, theta }
    setOption(temp, this)
    this.dots.forEach(e => e.set(temp))
    this.routes.forEach(e => e.set(temp))
    this.baseFloor.set(temp)
    console.log(temp)
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
    // Queue.next()
    // Request the browser the call render once its ready for a new frame
    // requestAnimationFrame(() => this.draw())
  }
}

export default SomeMap
