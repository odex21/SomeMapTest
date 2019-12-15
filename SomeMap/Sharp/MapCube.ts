import Cube, { CubeOption } from "./Cube"
import { TileInfo } from '../data/tailInfo'

interface MapCubeOption extends CubeOption {
  tileInfo: TileInfo
}

class MapCube extends Cube {
  tileInfo: TileInfo

  constructor(opt: MapCubeOption) {
    super(opt)

    this.tileInfo = opt.tileInfo
  }
}

export default MapCube
