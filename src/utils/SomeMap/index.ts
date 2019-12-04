
import Dot from './Sharp/Dot'
import Dot2 from './Sharp/Dot2'
import Cube from './Sharp/Cube'
import { setOption } from './utils/utils'
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
      x: 0 * - width / 2,
      z: 0 * -height / 2,
      y: -5,
      radius: width / 2,
      cubeHeight: 5,
      faceColor: '#414141'
    })
    this.init(mapData)

    const baseOpt = { PERSPECTIVE, PROJECTION_CENTER_X: width / 2, PROJECTION_CENTER_Y: width / 2, theta }
    this.setPerspective(baseOpt)
    this.baseFloor.set(baseOpt)
    this.draw()



    this.canvas.addEventListener('click', (evt) => {
      let hit = false
      this.dots.reduceRight((pre, e) => {
        if (hit) return false
        hit = e.pointInPath(evt)
        return false
      }, false)
    })
  }

  init(mapdata: MapData) {

    const { width, height } = mapdata
    console.log(width, height)
    const { width: canvasWidth, height: canvasHeight } = this.canvas
    const changeToGreen = (cube: Cube) => {
      cube.faceColor[1] = 'rgba(0, 255, 0, 0.7)'
      this.draw()
    }

    const r = this.canvas.width / (width + 4)
    let i = 0
    for (let h = height; h > -2; h--) {
      for (let w = width; w > -2; w--) {

        console.log(h, w, i++)
        if (h === height || h === -1 || w === width || w === -1) {
          // if (h === height) continue
          const cube = new Cube(this.context, this, {
            canvasWidth,
            canvasHeight,
            x: (w - (width / 2) + 1) * r,
            z: (h - (height / 2) + 2) * r,
            y: -10,
            radius: r / 2,
            cubeHeight: 10,
            faceColor: 'rgb(230, 230, 230)'
          })
          this.dots.push(cube)
          continue
        }
        const tile = mapData.tiles[h * width + w]
        const target = tileInfo[tile.tileKey]
        const random = tile.heightType ? 40 : 15
        const cube = new Cube(this.context, this, {
          canvasWidth,
          canvasHeight,
          x: (w - (width / 2) + 1) * r,
          z: (h - (height / 2) + 2) * r,
          y: -random,
          radius: r / 2,
          cubeHeight: random,
          faceColor: target.color
        })
        this.dots.push(cube)
        cube.on('click', changeToGreen)
      }
    }

    let ii = 0
    for (let h = 0; h < height + 2; h++) {
      const temp = [], temp2 = []
      for (let w = 0; w < width + 2; w++) {
        const cube = this.dots[ii++]

        if (w < width / 2 + 1) temp2.push(cube)
        else temp.push(cube)
      }
      this.updateArr.push(...temp2.reverse())
      this.updateArr.push(...temp)
    }
    console.log(this.updateArr)
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

    this.updateArr.forEach((e) => e.draw())
    // Request the browser the call render once its ready for a new frame
    // requestAnimationFrame(() => this.draw())
  }
}

export default SomeMap
