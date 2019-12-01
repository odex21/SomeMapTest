
import Dot from './Sharp/Dot'
import Dot2 from './Sharp/Dot2'
import Cube from './Sharp/Cube'
type Sharp = Cube | Dot

// // const width = 40, height = 30
// let PERSPECTIVE = width * 0.8; // The field of view of our 3D scene
// let PROJECTION_CENTER_X = width / 2; // x center of the canvas
// let PROJECTION_CENTER_Y = height / 2; // y center of the canvas

class SomeMap {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  dots: Cube[]
  PERSPECTIVE: number
  PROJECTION_CENTER_X: number
  PROJECTION_CENTER_Y: number
  i: number = 0
  theta: number

  constructor(container: HTMLCanvasElement, theta: number = -75 / 360 * Math.PI) {
    this.theta = theta
    this.canvas = container
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.dots = []
    // this.context.clearRect(0, 0, width, height);
    const { width, height } = this.canvas
    console.log(width, height)
    this.PERSPECTIVE = 150
    this.PROJECTION_CENTER_X = width / 2
    this.PROJECTION_CENTER_Y = height / 2

    this.init(Cube)
    this.draw()
  }

  init(sharp: any) {
    const { width, height } = this.canvas
    const length = this.canvas.width / 15

    for (let i = 0; i < length; i++) {
      this.dots.push(new sharp(this.context, {
        width, height,
        x: (Math.random() - 0.5) * (width * 0.5),
        y: (Math.random() - 0.5) * (width * 0.5),
        z: (Math.random() - 0.5) * (width * 0.5),
        radius: 20,
      }))
    }
  }

  draw() {
    // this.context.fillStyle = 'rgba(255, 0, 0, 0.1)'
    // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    const { width, height } = this.canvas

    this.context.clearRect(0, 0, width, height);

    // Loop through the dots array and draw every dot
    this.dots.forEach((e) => e.draw({ theta: this.theta }))
    // console.log(this.theta)

    // console.log(this.i++)
    // Request the browser the call render once its ready for a new frame
    requestAnimationFrame(() => this.draw())
  }
}

export default SomeMap
