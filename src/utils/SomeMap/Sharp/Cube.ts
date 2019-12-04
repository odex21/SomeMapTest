import Base from './Base'
import { animate } from '../utils/animate'
import { setOption } from '../utils/utils'
import SomeMap from '..'

const checkVi = (e: number, offset: number) => e !== undefined ? e : (Math.random() - 0.5) * offset


const CUBE_LINES = [[0, 1], [1, 3], [3, 2], [2, 0], [2, 6], [3, 7], [0, 4], [1, 5], [6, 7], [6, 4], [7, 5], [4, 5]]
const CUBE_FACE = [[0, 1, 3, 2], [0, 1, 5, 4], [3, 2, 6, 7], [4, 5, 6, 7], [0, 2, 6, 4], [1, 3, 5, 7]]
const CUBE_VERTICES = [[-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1], [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1]]

class Cube extends Base {
  father: SomeMap
  cubeHeight: number
  PROJECTION_CENTER_X = this.canvasWidth / 2
  PROJECTION_CENTER_Y = this.canvasHeight / 2
  PERSPECTIVE = this.canvasWidth * 0.8;
  faces: Path2D[] = []
  faceColor: FaceColor = {
    0: 'rgba(96, 96, 96, 0.75)',
    1: 'rgba(200, 32, 32, 0.9)'
  }
  todo: BaseTodo = {}

  constructor(ctx: CanvasRenderingContext2D, father: SomeMap, cubeOption: CubeOption) {
    super(ctx, { canvasWidth: cubeOption.canvasWidth, canvasHeight: cubeOption.canvasHeight })

    const { canvasWidth, canvasHeight, x, y, z, radius, theta, cubeHeight, faceColor } = cubeOption

    this.father = father
    this.x = checkVi(x, canvasWidth)
    this.y = checkVi(y, canvasHeight)
    this.z = checkVi(z, canvasHeight)
    this.cubeHeight = cubeHeight || radius
    if (faceColor) this.faceColor[1] = faceColor
    this.faceColor[2] = 'rgb(41, 41, 41, 0.9)'

    this.radius = radius || Math.floor(Math.random() * 12 + 10)
    this.theta = theta || 0

    ctx.strokeStyle = 'rgb(64, 170, 191, 0.5)'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 2

  }


  set(opt: CubeSetOption) {
    setOption(opt, this)
  }

  pointInPath(evt: MouseEvent) {
    const hit = this.faces.some(e => this.ctx.isPointInPath(e, evt.layerX, evt.layerY))
    if (hit) {
      console.log(this.faces)
      this.faceColor[1] = 'rgba(0, 255, 0, 0.7)'
      this.todo[evt.type].forEach(e => e.call(this, this))
      return hit
    } else return false
  }

  on(type: keyof GlobalEventHandlersEventMap, todo: Function) {
    if (!this.todo[type]) this.todo[type] = []
    this.todo[type].push(todo)
  }

  animate(opt: CubeAnimationOption) {
    animate(this, 10000, opt)
  }

  // Do some math to project the 3D position into the 2D canvas
  project({ x, y, z }: Vi) {
    const sizeProjection = this.PERSPECTIVE / (this.PERSPECTIVE + z)
    const xProject = (x * sizeProjection) + this.PROJECTION_CENTER_X
    const yProject = (y * sizeProjection) + this.PROJECTION_CENTER_Y
    return {
      size: sizeProjection,
      x: xProject,
      y: yProject
    }
  }
  // Draw the dot on the canvas
  viToXy([x, y, z]: number[]) {
    const trans = ({ x, y, z }: Vi): Vi => ({
      x: x,
      y: y * Math.cos(this.theta) + z * Math.sin(this.theta),
      z: y * Math.sin(this.theta) + z * Math.cos(this.theta)
    })

    const temp = {
      x: this.x + this.radius * x,
      y: this.y + this.cubeHeight * y,
      z: this.z + this.radius * z
    }
    return this.project(trans(temp))
  }

  drawFace(index: number = 1) {
    const path = new Path2D()
    const ctx = this.ctx
    CUBE_FACE[index].forEach((e, i) => {
      const { x, y } = this.viToXy(CUBE_VERTICES[e])
      if (i === 0) path.moveTo(x, y)
      else path.lineTo(x, y)
    })
    path.closePath()
    ctx.fillStyle = this.faceColor[index] || this.faceColor[0]
    ctx.fill(path)
    if (index > -1) this.faces[index] = path
  }

  draw() {

    const ctx = this.ctx
    // Do not render a cube that is in front of the camera
    if (this.z < -this.PERSPECTIVE + this.radius) {
      return
    }


    for (let i = 0; i < CUBE_LINES.length; i++) {

      const v1Project = this.viToXy(CUBE_VERTICES[CUBE_LINES[i][0]])
      const v2Project = this.viToXy(CUBE_VERTICES[CUBE_LINES[i][1]])

      ctx.beginPath()
      ctx.moveTo(v1Project.x, v1Project.y)
      ctx.lineTo(v2Project.x, v2Project.y)

      ctx.stroke()
    }
    this.drawFace(0)
    this.drawFace(1)
    // ctx.globalAlpha = Math.abs(this.z / (this.width * 0.5));
  }


}

export default Cube
