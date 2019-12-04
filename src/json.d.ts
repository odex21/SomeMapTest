declare module "*mapdata.json" {
  const value: {
    mapData: MapData
  }
  export default value
}


declare module "*.json" {
  const value: any
  export default value
}



interface Tiles {
  tileKey: string,
  heightType: number,
  buildableType: number,
  passableMask: number,
  blackboard: any,
  effects: Effect
}


interface Effect {
  key: string,
  offset: {
    x: number,
    y: number,
    z: number
  },
  direction: number
}

interface MapData {
  map: number[][]
  tiles: Tiles[]
  width: number
  height: number
}

