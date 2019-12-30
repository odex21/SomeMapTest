
import Cube, { CubeSetOption } from './Sharp/Cube'
import { setOption, sleep, TaskQueue, arrangeCube, changeXZ, loadImage } from './utils/utils'


import { tileInfo } from './data/tailInfo'
import PathLine from './Sharp/PathLine'
import MapCube from './Sharp/MapCube'
import { Grid } from 'pathfinding'
import { MapData, Route, R } from './data/mapdata'
import { addRoutes } from './utils/pathfinding'
import { Perspective, Pos, MapMouseEvent, LinePoint } from './Sharp/Base'
import StopCube from './Sharp/StopCube'

interface StopRoute {
  animate: () => Promise<void>
  set: () => void
  draw: () => void
}

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
  drawing: boolean = false
  baseOpt: any
  routes: Map<number, (PathLine | StopRoute | StopCube)[]> = new Map()
  RawRoutes!: R[]
  r!: number
  xz!: (x: Pos) => Pos
  background!: HTMLImageElement
  grid!: Grid
  looping: boolean = true

  constructor(container: HTMLCanvasElement, theta: number = -75 / 360 * Math.PI, PERSPECTIVE: number, mapData: MapData, routes: R[]) {
    this.canvas = container
    let { width, height } = this.canvas.getBoundingClientRect()
    width *= 2
    height *= 2
    this.canvas.width = width
    this.canvas.height = height
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.canvasWidth = width
    this.canvasHeight = height


    console.log(width, height, this.r)

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



    this.init(mapData, routes)

    console.log(mapData, routes)
    const perspecOpt = { perspective: { PERSPECTIVE, PROJECTION_CENTER_X: width / 2, PROJECTION_CENTER_Y: height / 2 }, theta }

    this.setPerspective(perspecOpt)
    setTimeout(() => {
      // this.loopRoutes(0, 5)
      this.loopRoute(1, 24)
      // this.loopRoute(2, 24)
    }, 1000)
    // this.loopRoute(1, 250)
    // setTimeout(() => {
    //   this.deleteRoute(16)
    //   console.log(this.routes)
    //   setTimeout(() => {
    //     this.loopRoute(20)
    //   }, 2000)
    // }, 2000)
    // this.loopRoutes(0)

    this.loop()


    this.canvas.addEventListener('click', (evt) => {
      for (let i = this.dots.length - 1; i > -1; i--) {
        const hit = this.dots[i].pointInPath(evt as MapMouseEvent)
        if (hit) break
      }
    })
  }

  loop() {
    requestAnimationFrame(() => {
      this.draw(false)
        .then(() => this.looping && this.loop())
    })
  }

  init(mapdata: MapData, routes: R[]) {
    // test Path

    this.r = Math.min(this.canvas.width / (mapdata.width), this.canvas.height / (mapdata.height))
    this.xz = changeXZ(mapdata.width, mapdata.height, this.r, 0.5, 0.5)
    this.RawRoutes = routes
    this.dots = []
    this.routes = new Map()

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

        // 地板数据
        // todo 还要再拿设置的数据
        // ? 存到tile里
        const target = tileInfo[tile.tileKey]
        const cubeHeight = (tile.heightType ? topHeight + bottomHeight : bottomHeight) / 2

        const cube = new MapCube({
          ...baseOpt,
          cubeHeight,
          y: tile.heightType ? -cubeHeight : -cubeHeight,
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
    const { perspective, theta } = this
    if (perspective && theta) {
      this.setPerspective({ perspective, theta })
    }
  }

  deleteRoute(index: number) {
    this.routes.delete(index)
    if (this.routes.size === 0) this.looping = false
    console.log(this.routes)
  }

  deleteAll() {
    this.routes.clear()
  }

  async loopRoutes(from: number = 0, to: number = this.RawRoutes.length) {
    this.RawRoutes.slice(from, to)
      .map((raw, rIndex) => {
        if (raw) this.initRoute(raw, rIndex)
      })
  }

  loopRoute(index: number, color: number) {
    if (this.routes.has(index)) {
      this.routes.delete(index)
    } else {
      const target = this.RawRoutes[index]
      if (target) {
        this.looping = true
        this.loop()
        this.initRoute(target, index, color)
      }
    }
  }

  initRoute(raw: Route, rIndex: number, color: number = Math.floor(Math.random() * 360)) {
    const { canvasHeight, canvasWidth } = this
    const r = addRoutes(raw, this)
    const route = r.map(({ points, time, stop }) => {
      const fly = raw.motionMode === 1
      if (points) {
        return this.initPath(points, time, color, fly)
      } else if (stop) {
        const { x, y } = this.xz(stop.pos)
        const stopCube = new StopCube({
          x: x,
          z: y,
          y: fly ? -this.r : -this.r / 3,
          cubeHeight: this.r * 0.05 / 2,
          canvasWidth,
          canvasHeight,
          radius: this.r / 2,
          pos: { x, y: y / 2 },
          ctx: this.context,
          father: this,
          time: stop.time,
          faceColor: 'rgba(144,230, 13, 0.7)'
        })
        setOption({ perspective: this.perspective, theta: this.theta }, stopCube)
        return stopCube

      } else return {
        // 停止方块
        animate: () => Promise.resolve(),
        draw: () => { },
        set: () => { }
      } as StopRoute
    })
    this.routes.set(rIndex, route)
    const loop = () => {
      const animations = route.map(e => e.animate.bind(e))
      const queue = new TaskQueue(1, () => {
        console.log('next')
        // loop()
      }, animations)
      queue.next()
    }
    loop()
  }
  initPath(points: LinePoint[], time: number = 2000, color?: number, fly: boolean = false) {
    const pArr = points.map(e => this.xz(e))
    const line = new PathLine({
      ...this.baseOpt,
      width: this.r / 10,
      y: fly ? -this.r : -this.r / 2,
      r: this.r,
      points: pArr,
      time,
      color
    })
    setOption({ perspective: this.perspective, theta: this.theta }, line)
    return line
  }

  setPerspective(opt: CubeSetOption) {
    // todo update canvas width & height
    setOption(opt, this)
    this.dots.forEach(e => e.set(opt))
    this.routes.forEach(e => e.forEach(r => r.set(opt)))
    this.baseFloor.set(opt)
    this.draw(true)
  }

  update() {
    /*     if (!this.looping) {
          this.looping = true
          this.loop()
        } */
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

    } else {
      this.background && this.context.drawImage(this.background, 0, 0)
    }

    this.routes.forEach(e => {
      Queue.pushTask(async () => {
        if (!this.drawing) Queue.clear()
        e.forEach(r => r.draw())
      })
    })

    if (isMapUpdate) {
      Queue.pushTask(async () => {
        const data = this.canvas.toDataURL()
        this.background = await loadImage(data)
      })
    }
  }
}

export default SomeMap
