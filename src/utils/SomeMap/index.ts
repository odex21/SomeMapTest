
import Cube from './Sharp/Cube'
import { setOption, sleep, TaskQueue, arrangeCube, changeXZ, loadImage } from './utils/utils'


import { tileInfo } from './data/tailInfo'
import { CubeSetOption, Pos, MapMouseEvent, LinePoint, Perspective } from './Sharp'
import PathLine from './Sharp/PathLine'
import MapCube from './Sharp/MapCube'
import { Grid } from 'pathfinding'
import { MapData, Route, R } from '@/utils/SomeMap/data'
import { addRoutes } from './utils/pathfinding'



class SomeMap {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  canvasWidth: number
  canvasHeight: number
  dots: Cube[] = []
  perspective!: Perspective
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
  routes: PathLine[] = []
  RawRoutes: R[]
  r: number
  xz: (x: Pos) => Pos
  background!: HTMLImageElement
  grid!: Grid

  constructor(container: HTMLCanvasElement, theta: number = -75 / 360 * Math.PI, PERSPECTIVE: number, mapData: MapData, routes: R[]) {
    this.canvas = container
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
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
    this.RawRoutes = routes
    console.log(mapData, routes)
    const perspecOpt = { perspective: { PERSPECTIVE, PROJECTION_CENTER_X: width / 2, PROJECTION_CENTER_Y: height / 2 }, theta }

    this.setPerspective(perspecOpt)
    this.loopRoutes(16, 17)
    // this.loopRoutes(0)


    this.canvas.addEventListener('click', (evt) => {
      for (let i = this.dots.length - 1; i > -1; i--) {
        const hit = this.dots[i].pointInPath(evt as MapMouseEvent)
        if (hit) break
      }
    })
  }



  init(mapdata: MapData) {
    // test Path

    const r = this.r
    const { width, height } = mapdata
    const { width: canvasWidth, height: canvasHeight } = this.canvas

    console.log(width, height)

    const bottomHeight = r * 0.1
    const topHeight = r * 0.25


    // todo gird
    const grids: number[][] = []

    for (let y = height - 1; y > -1; y--) {
      const top = []
      const bottom = []

      // todo gird
      const gridArr: number[] = []

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

        // todo gird
        const { tileKey: key, passableMask } = tile
        const crossAble = !/end|hole/.test(key) && passableMask === 3 ? 0 : 1
        gridArr.push(crossAble)

        const target = tileInfo[tile.tileKey]
        const cubeHeight = (tile.heightType ? topHeight : bottomHeight) / 2

        const cube = new MapCube({
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

      grids.push(gridArr.reverse())
      this.dots.push(...arrangeCube(bottom, width), ...arrangeCube(top, width))
    }

    this.grid = new Grid(grids.reverse())
  }

  async loopRoutes(from: number = 0, to: number = this.RawRoutes.length) {

    for (let i = from; i < to; i++) {
      const temp = this.RawRoutes[i]
      if (temp) {
        let route
        try {
          route = addRoutes(temp, this)
        } catch (error) {
          console.log(route, temp, i)
          console.error(error)
        }
        console.log(temp)
        if (!route) continue
        for (let j = 0; j < route.length; j++) {
          const { points, time } = route[j]
          if (points) {
            const line = this.addPath(points, time)
            this.routes.push(line)
            await line.animate()
          }
        }

      }
    }
  }

  addPath(points: LinePoint[], time: number = 2000) {
    const pArr = points.map(e => this.xz(e))
    const line = new PathLine({
      ...this.baseOpt,
      width: 10,
      y: -50,
      r: this.r,
      points: pArr,
      time
    })
    setOption({ perspective: this.perspective, theta: this.theta }, line)
    return line
  }

  setPerspective(opt: CubeSetOption) {
    // todo update canvas width & height
    setOption(opt, this)
    this.dots.forEach(e => e.set(opt))
    this.routes.forEach(e => e.set(opt))
    this.baseFloor.set(opt)
    this.draw(true)
  }

  async draw(isMapUpdate: boolean) {
    if (this.drawing) {
      this.drawing = false
      await sleep(100)
    }
    this.drawing = true
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    const Queue = new TaskQueue(1, () => this.drawing = false)


    // Loop through the dots array and draw every dot
    if (isMapUpdate) {
      Queue.pushTask(() => {
        this.baseFloor.draw()
        return Promise.resolve()
      })

      this.dots.forEach((e) => {
        Queue.pushTask(async () => {
          if (!this.drawing) Queue.clear()
          e.draw()
        })
      })

      Queue.pushTask(async () => {
        const data = this.canvas.toDataURL()
        this.background = await loadImage(data)
      })
    } else {
      this.context.drawImage(this.background, 0, 0)
    }

    this.routes.forEach(e => {
      Queue.pushTask(async () => {
        if (!this.drawing) Queue.clear()
        e.draw()
      })
    })
  }
}

export default SomeMap
