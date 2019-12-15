import { Pos, LinePoint } from "../Sharp/Base"
import { RoutePos } from "../data/mapdata"
import Pathfinding, { Grid } from "pathfinding"

interface Options {
  [index: string]: any
}
type P = () => Promise<any>

interface GradientParm {
  vector: Vector
  colors: GradientColor[]
}

interface GradientColor {
  color: string
  p: number
}

interface Vector {
  p1: Pos
  p2: Pos
}

interface SimplePathPoint extends RoutePos {
  type?: number
  reachOffset?: Pos
}

interface PFResArr {
  points?: LinePoint[]
  time?: number
  stop?: {
    time: number
    pos: LinePoint
  }
}

interface MyGird extends Grid {
  nodes: Pathfinding.Node[][]
}

interface ArrayPoint extends Array<number> {
  0: number
  1: number
}
