import { Pos } from './utils/SomeMap/Sharp'

declare module "mapdata.json" {
  const value: {
    mapData: MapData
    routes: Route[]
  }
  export default value
}


// declare module "*.json" {
//   const value: any
//   export default value
// }



interface Tiles {
  tileKey: string,
  heightType: number,
  buildableType: number,
  passableMask: number,
  blackboard: any,
  effects: Effect | null,
  events?: {
    [index: string]: Function[]
  }
  [index: string]: any
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

interface RoutePos {
  col: number
  row: number
}

interface PathPoint {
  type: number
  time: number
  position: RoutePos
  reachOffset: Pos
  randomizeReachOffset: boolean
  reachDistance: number
}

interface Route {
  motionMode: number
  startPosition: RoutePos
  endPosition: RoutePos
  spawnRandomRange: Pos
  spawnOffset: Pos
  checkpoints: PathPoint[]
  allowDiagonalMove: boolean
}

interface MapData {
  map: number[][]
  tiles: Tiles[]
  width: number
  height: number
}

// import data from './mapdata.json'
type R = Route | null

interface Data {
  mapData: MapData
  routes: R[]
}
