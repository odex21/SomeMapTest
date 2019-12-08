import { Pos } from "../Sharp"

interface Options {
  [index: string]: any
}
type P = () => Promise<any>

interface GradientParm {
  p1: Pos
  p2: Pos
  colors?: {
    color: string
    p: number
  }[]
}
