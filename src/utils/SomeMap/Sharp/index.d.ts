import SomeMap from ".."

interface BaseOption {
  ctx: CanvasRenderingContext2D
  father: SomeMap
  canvasWidth: number
  canvasHeight: number
}


interface CubeOption extends BaseOption {
  x: number
  y: number
  z: number
  pos: Pos
  theta?: number
  radius?: number
  cubeWidth?: number
  cubeHeight?: number
  cubeLength?: number
  faceColor?: string
}

interface CubeSetOption {
  theta?: number
  PERSPECTIVE?: number
  PROJECTION_CENTER_X?: number
  PROJECTION_CENTER_Y?: number
  faceColor?: FaceColor
}

interface LineOption extends BaseOption {
  points: LinePoint[]
  r: number
  width?: number
  y?: number
}

type LinePoint = Pos

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

interface Pos {
  x: number
  y: number
}

interface CubeAnimationOption extends CubeSetOption {
  x?: number
  y?: number
  z?: number
}
