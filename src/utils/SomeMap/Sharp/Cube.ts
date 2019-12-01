import Base from './Base'
import { animate } from '../utils/animate'


const CUBE_LINES = [[0, 1], [1, 3], [3, 2], [2, 0], [2, 6], [3, 7], [0, 4], [1, 5], [6, 7], [6, 4], [7, 5], [4, 5]];
const CUBE_FACE = [[0, 1, 3, 2], [0, 1, 5, 4], [3, 2, 6, 7], [4, 5, 6, 7], [0, 2, 6, 4], [1, 3, 5, 7]];
const CUBE_VERTICES = [[-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1], [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1]];

class Cube extends Base {
  PROJECTION_CENTER_X = this.width / 2
  PROJECTION_CENTER_Y = this.height / 2
  FIELD_OF_VIEW = this.width * 0.8;

  constructor(ctx: CanvasRenderingContext2D, { width, height, x, y, z, radius, theta }: CubeOption) {
    super(ctx, { width, height })
    this.x = (Math.random() - 0.5) * width;
    this.y = (Math.random() - 0.5) * height;
    // this.y = 100
    // this.z = (Math.random() - 0.5) * width;
    this.z = 100
    this.radius = radius || Math.floor(Math.random() * 12 + 10);
    this.theta = theta || 0//-75 / 360 * Math.PI; // Random value between [0, 2Pi]
    // this.phi = Math.acos((Math.random() * 2) - 1); // Random value between [0, Pi]
    animate(this, 10000, { x: x + 200 })

  }
  // Do some math to project the 3D position into the 2D canvas
  project({ x, y, z }: Vi) {
    const sizeProjection = this.FIELD_OF_VIEW / (this.FIELD_OF_VIEW + z);
    const xProject = (x * sizeProjection) + this.PROJECTION_CENTER_X;
    const yProject = (y * sizeProjection) + this.PROJECTION_CENTER_Y;
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
      y: this.y + this.radius * y,
      z: this.z + this.radius * z
    }
    return this.project(trans(temp))
  }
  drawFace(index: number = 1, color: string = 'rgb(0, 0, 0, 0.2)') {
    const ctx = this.ctx
    ctx.fillStyle = color
    ctx.beginPath()
    CUBE_FACE[index].forEach((e, i) => {
      const { x, y } = this.viToXy(CUBE_VERTICES[e])
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.fill()
  }
  setOption({ theta }: CubeSetOption) {
    if (theta) this.theta = theta
  }
  draw(opt: CubeSetOption) {
    if (opt) this.setOption(opt)
    const ctx = this.ctx
    // Do not render a cube that is in front of the camera
    if (this.z < -this.FIELD_OF_VIEW + this.radius) {
      return;
    }
    for (let i = 0; i < CUBE_LINES.length; i++) {

      const v1Project = this.viToXy(CUBE_VERTICES[CUBE_LINES[i][0]])
      const v2Project = this.viToXy(CUBE_VERTICES[CUBE_LINES[i][1]])

      ctx.beginPath();
      ctx.moveTo(v1Project.x, v1Project.y);
      ctx.lineTo(v2Project.x, v2Project.y);
      ctx.stroke();
    }
    this.drawFace(1, 'rgb(255, 0, 0, 0.7)')
    this.drawFace(0)
    // ctx.globalAlpha = Math.abs(this.z / (this.width * 0.5));
  }
}

export default Cube
