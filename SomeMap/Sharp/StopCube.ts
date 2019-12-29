import Cube, { CubeOption, CUBE_FACE, CUBE_VERTICES, FaceColor } from './Cube'


interface StopCubeOption extends CubeOption {
  time: number
}
class StopCube extends Cube {
  time: number


  constructor(opt: StopCubeOption) {
    super(opt)
    this.time = opt.time
    this.faceColor[0] = 'rgba(41, 230, 41, 0.3)'

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

    if (index === 1) {
      // todo feat mobile font-size
      const { x, y } = this.viToXy([0, 0, 0])

      let text = this.pos.x === 0 ? this.pos.y :
        this.pos.y === 0 ? this.pos.x : this.text
      // if(this.pos.x === 0 || this.pos.y === 0) text = this.pos.x ||

      ctx.font = `${this.radius / 2}px sans-serif`
      ctx.fillStyle = 'white'
      ctx.textAlign = 'center'
      ctx.fillText(this.time + 's ', x, y)
    }

    ctx.restore()
    if (index === 0 || index === 1) this.faces[index] = path
  }

  animate() {
    return Promise.resolve()
  }

}

export default StopCube
