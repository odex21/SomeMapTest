
import Dot from './Sharp/Dot'
import Dot2 from './Sharp/Dot2'
import Cube from './Sharp/Cube'
import { setOption, changeToGreen } from './utils/utils'
import testData from './data/mapdata.json'
const { mapData } = testData
import { tileInfo } from './data/tailInfo'
console.log(mapData)

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

  constructor(container: HTMLCanvasElement, theta: number = -75 / 360 * Math.PI, PERSPECTIVE: number) {
    this.canvas = container
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
    // this.context.clearRect(0, 0, width, height);
    const { width, height } = this.canvas
    this.canvasWidth = width
    this.canvasHeight = height

    console.log(width, height)
    // this.PERSPECTIVE = PERSPECTIVE

    this.baseFloor = new Cube(this.context, this, {
      canvasWidth: width,
      canvasHeight: height,
      x: 0,
      z: 0,
      y: -5,
      radius: width / 2,
      cubeHeight: 5,
      faceColor: '#414141',
      cubeLength: height / 2,
      cubeWidth: width / 2,
      pos: { x: 0, y: 0 }
    })
    this.init(mapData)

    const baseOpt = { PERSPECTIVE, PROJECTION_CENTER_X: width / 2, PROJECTION_CENTER_Y: height / 2, theta }
    this.setPerspective(baseOpt)
    this.baseFloor.set(baseOpt)
    this.draw()


    this.canvas.addEventListener('click', (evt) => {
      for (let i = this.dots.length - 1; i > -1; i--) {
        const hit = this.dots[i].pointInPath(evt)
        if (hit) break
      }
    })
  }

  init(mapdata: MapData) {

    const { width, height } = mapdata
    console.log(width, height)
    const { width: canvasWidth, height: canvasHeight } = this.canvas

    const r = Math.min(this.canvas.width / (width + 2), this.canvas.height / (height + 2))
    const xOffset = 0.5
    const yOffset = 0.5

    const arounds = []
    const top = []
    const bottom = []

    let i = 0
    for (let h = height; h > -2; h--) {
      for (let w = width; w > -2; w--) {
        const pos = {
          x: (w - (width / 2) + xOffset) * r,
          z: (h - (height / 2) + yOffset) * r,
          y: 5,
          canvasWidth,
          canvasHeight,
          radius: r / 2,
          pos: { x: w, y: h }
        }

        if (h === height || h === -1 || w === width || w === -1) {
          const cube = new Cube(this.context, this, {
            ...pos,
            cubeHeight: 10,
            faceColor: 'rgb(230, 230, 230)',
          })
          arounds.push(cube)
          continue
        }

        const tile = mapData.tiles[h * width + w]
        const target = tileInfo[tile.tileKey]
        const random = tile.heightType ? 40 : 15

        const cube = new Cube(this.context, this, {
          ...pos,
          y: -random,
          cubeHeight: random,
          faceColor: target.color,
        })

        if (random > 15) top.push(cube)
        else bottom.push(cube)

        cube.on('click', changeToGreen)
      }
    }

    const arrange = (arr: Cube[], defaultX: number) => {
      const res: Cube[] = []
      let temp1: Cube[] = [], temp2: Cube[] = []

      let curY: number
      arr.forEach((el) => {
        const { x, y } = el.pos
        if (!curY) curY = y
        if (x < defaultX / 2 + 1) temp2.push(el)
        else temp1.push(el)

        if (y !== curY) {
          curY = y
          res.push(...temp2.reverse(), ...temp1)
          temp1 = []
          temp2 = []
        }
      })
      res.push(...temp2.reverse(), ...temp1)

      return res
    }

    const a = arrange(arounds, width)
    const b = arrange(bottom, width)
    const t = arrange(top, width)

    this.dots.push(...a, ...b, ...t)
  }



  setPerspective(opt: CubeSetOption) {
    // todo update canvas width & height
    const { PERSPECTIVE, PROJECTION_CENTER_X, PROJECTION_CENTER_Y, theta } = opt
    const temp = { PERSPECTIVE, PROJECTION_CENTER_X, PROJECTION_CENTER_Y, theta }
    setOption(temp, this)
    this.dots.forEach(e => e.set(temp))
    this.baseFloor.set(temp)
  }

  draw() {

    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.baseFloor.draw()
    // Loop through the dots array and draw every dot

    this.dots.forEach((e) => e.draw())
    // Request the browser the call render once its ready for a new frame
    // requestAnimationFrame(() => this.draw())
  }
}

export default SomeMap
