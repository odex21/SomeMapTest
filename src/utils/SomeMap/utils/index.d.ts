import { Pos } from "../Sharp"

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
