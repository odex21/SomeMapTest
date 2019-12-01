import Base from './Base'
import { animate } from '../utils/animate'


const CUBE_LINES = [[0, 1], [1, 3], [3, 2], [2, 0], [2, 6], [3, 7], [0, 4], [1, 5], [6, 7], [6, 4], [7, 5], [4, 5]];
const CUBE_VERTICES = [[-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1], [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1]];

class Cube extends Base {
  PROJECTION_CENTER_X = this.width / 2
  PROJECTION_CENTER_Y = this.height / 2
  FIELD_OF_VIEW = this.width * 0.8;

  constructor(ctx: CanvasRenderingContext2D, { width, height, x, y, z, radius, theta, phi }: CubeOption) {
    super(ctx, { width, height })
    this.x = (Math.random() - 0.5) * width;
    this.y = (Math.random() - 0.5) * width;
    this.y = 100
    this.z = (Math.random() - 0.5) * width;
    // this.z = 100
    this.radius = radius ? radius : Math.floor(Math.random() * 12 + 10);
    this.theta = -65 / 360 * Math.PI; // Random value between [0, 2Pi]
    // this.phi = Math.acos((Math.random() * 2) - 1); // Random value between [0, Pi]
    // animate(this, 10000, { x, z })

  }
  // Do some math to project the 3D position into the 2D canvas
  project(x: number, y: number, z: number) {
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
  draw() {
    const ctx = this.ctx
    // Do not render a cube that is in front of the camera
    if (this.z < -this.FIELD_OF_VIEW + this.radius) {
      return;
    }
    for (let i = 0; i < CUBE_LINES.length; i++) {
      let v1 = {
        x: this.x + (this.radius * CUBE_VERTICES[CUBE_LINES[i][0]][0]),
        y: this.y + (this.radius * CUBE_VERTICES[CUBE_LINES[i][0]][1]),
        z: this.z + (this.radius * CUBE_VERTICES[CUBE_LINES[i][0]][2])
      };

      let v2 = {
        x: this.x + (this.radius * CUBE_VERTICES[CUBE_LINES[i][1]][0]),
        y: this.y + (this.radius * CUBE_VERTICES[CUBE_LINES[i][1]][1]),
        z: this.z + (this.radius * CUBE_VERTICES[CUBE_LINES[i][1]][2])
      };
      const trans = ({ x, y, z }: Vi): Vi => {
        // const r = Math.sqrt(v1.x ** 2 + v1.y ** 2 + v1.z ** 2)
        return {
          x: x,
          y: y * Math.cos(this.theta) + z * Math.sin(this.theta),
          z: y * Math.sin(this.theta) + z * Math.cos(this.theta)
        }
      }
      v1 = trans(v1)
      v2 = trans(v2)

      const v1Project = this.project(v1.x, v1.y, v1.z);
      const v2Project = this.project(v2.x, v2.y, v2.z);
      ctx.beginPath();
      ctx.moveTo(v1Project.x, v1Project.y);
      ctx.lineTo(v2Project.x, v2Project.y);
      ctx.stroke();
    }
    // ctx.globalAlpha = Math.abs(this.z / (width * 0.5));
  }
}

export default Cube
