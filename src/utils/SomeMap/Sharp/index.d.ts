
interface BaseOption {
  width: number
  height: number

}


interface CubeOption extends BaseOption {
  x: number
  y: number
  z: number
  theta?: number
  radius?: number
}

interface CubeSetOption {
  theta?: number
}

interface Vi {
  x: number,
  y: number,
  z: number
}

