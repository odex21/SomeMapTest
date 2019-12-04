
interface BaseOption {
  canvasWidth: number
  canvasHeight: number
}


interface CubeOption extends BaseOption {
  x: number
  y: number
  z: number
  theta?: number
  radius: number
  cubeHeight?: number
  faceColor?: string
}

interface CubeSetOption {
  theta?: number
  PERSPECTIVE?: number
  PROJECTION_CENTER_X?: number
  PROJECTION_CENTER_Y?: number
  faceColor?: FaceColor
}

interface Vi {
  x: number,
  y: number,
  z: number
}

interface Evt {
  x: number
  y: number
}

interface FaceColor {
  [index: number]: string
}

interface BaseTodo {
  [index: string]: Function[]
}


interface CubeAnimationOption extends CubeSetOption {
  x?: number
  y?: number
  z?: number
}
