import { BaseTodo, Pos, FaceColor, CubeOption, CubeSetOption, Vi, CubeAnimationOption } from '.'
import Base from './Base'
import { animate as _animate } from '../utils/animate'
import { setOption } from '../utils/utils'
import SomeMap from '..'

const checkVi = (e: number, offset: number) => e !== undefined ? e : (Math.random() - 0.5) * offset


const CUBE_LINES = [[0, 1], [1, 3], [3, 2], [2, 0], [2, 6], [3, 7], [0, 4], [1, 5], [6, 7], [6, 4], [7, 5], [4, 5]]
const CUBE_FACE = [[0, 1, 3, 2], [0, 1, 5, 4], [3, 2, 6, 7], [4, 5, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]]
const CUBE_VERTICES = [[-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1], [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1]]

class Cube extends Base {
  width: number
  length: number
  height: number
  PROJECTION_CENTER_X = this.canvasWidth / 2
  PROJECTION_CENTER_Y = this.canvasHeight / 2
  PERSPECTIVE = this.canvasWidth * 0.8;
  faces: Path2D[] = []
  faceColor: FaceColor = {
    0: 'rgba(96, 96, 96, 0.75)',
    1: 'rgba(200, 32, 32, 0.9)'
  }
  todo: BaseTodo = {}
  pos: Pos
  strokeStyle: string = 'rgb(64, 170, 191, 0.5)'

  constructor(cubeOption: CubeOption) {
    super(cubeOption)

    const { cubeLength, cubeWidth, cubeHeight, canvasWidth, canvasHeight, x, y, z, radius, theta, faceColor, pos } = cubeOption
    this.radius = radius || Math.floor(Math.random() * 12 + 10)
    this.pos = pos
    this.width = cubeWidth || this.radius
    this.height = cubeHeight || radius || 10
    this.length = cubeLength || this.radius

    this.x = checkVi(x, canvasWidth)
    this.y = checkVi(y, canvasHeight)
    this.z = checkVi(z, canvasHeight)

    if (faceColor) this.faceColor[1] = faceColor
    this.faceColor[2] = 'rgb(41, 41, 41, 0.9)'

    this.theta = theta || 0

    this.strokeStyle = 'rgb(64, 170, 191, 0.5)'
    cubeOption.ctx.lineJoin = 'round'
    cubeOption.ctx.lineWidth = 2

  }


  set(opt: CubeSetOption) {
    setOption(opt, this)
  }

  pointInPath(evt: MouseEvent) {
    const hit = this.faces.some(e => this.ctx.isPointInPath(e, evt.layerX, evt.layerY))
    if (hit) {
      console.log(this.pos, this.todo[evt.type])
      this.todo[evt.type] && this.todo[evt.type].forEach(e => e.call(this, this, this.father))
      return hit
    } else return false
  }

  on(type: keyof GlobalEventHandlersEventMap, todo: Function) {
    if (!this.todo[type]) this.todo[type] = []
    this.todo[type].push(todo)
  }

  animate(opt: CubeAnimationOption) {
    _animate(this, 10000, opt)
  }

  // Do some math to project the 3D position into the 2D canvas
  project({ x, y, z }: Vi) {
    const sizeProjection = this.PERSPECTIVE / (this.PERSPECTIVE + y)
    const xProject = (x * sizeProjection) + this.PROJECTION_CENTER_X
    const yProject = (z * sizeProjection) + this.PROJECTION_CENTER_Y
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
      x: this.x + this.width * x,
      z: this.z + this.length * z,
      y: this.y + this.height * y,
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


    CUBE_LINES.forEach((line, index) => {
      if (index === 2 || index === 8) return
      if (index < 5) return
      const v1Project = this.viToXy(CUBE_VERTICES[line[0]])
      const v2Project = this.viToXy(CUBE_VERTICES[line[1]])

      this.ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(v1Project.x, v1Project.y)
      ctx.lineTo(v2Project.x, v2Project.y)
      this.ctx.strokeStyle = this.strokeStyle
      ctx.stroke()
    })

    this.drawFace(5)
    this.drawFace(4)
    this.drawFace(0)
    this.drawFace(1)
  }


}

export default Cube
