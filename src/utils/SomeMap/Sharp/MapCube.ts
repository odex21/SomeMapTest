import Cube from "./Cube"
import { MapCubeOption } from '.'

class MapCube extends Cube {
  tileInfo: TileInfo

  constructor(opt: MapCubeOption) {
    super(opt)

    this.tileInfo = opt.tileInfo
  }
}

export default MapCube
