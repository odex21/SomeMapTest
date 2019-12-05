import SomeMap from '..'
import Cube from '../Sharp/Cube'

const setOption = (option: Options, target: any) => {
  Object.keys(option).forEach(e => {
    if (option[e])
      target[e] = option[e]
  })
}

const changeToGreen = (cube: Cube, context: SomeMap) => {
  cube.faceColor[1] = 'rgba(0, 255, 0, 0.7)'
  console.log(cube)
  context.draw()
}

export {
  setOption,
  changeToGreen
}
