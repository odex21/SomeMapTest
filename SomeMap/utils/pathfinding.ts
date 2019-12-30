import PF from 'pathfinding'
import { Finder, Grid } from 'pathfinding'

import { Route, RoutePos } from '../data/mapdata'
import { MyGird, SimplePathPoint, PFResArr, ArrayPoint } from '.'
import SomeMap from '..'
import { Pos } from 'SomeMap/Sharp/Base'

const pArray = <T>(arr: T[], index: number, p: (arg: T) => T) => {
  arr[index] = p(arr[index])
  return arr
}
const mergeReachOffset = (r: Pos | undefined) => (p: SimplePathPoint) => r ? ({
  col: p.col + r.x,
  row: p.row + r.y
}) : p

const isSamePoint = (p1: RoutePos, p2: RoutePos) => p1.col === p2.col && p1.row === p2.row //arr.slice(index + 1).filter(el => el.type !== 3).length !== 1;

const compare = (x: number, y: number) => {
  if (x > y) return [y, x]
  else return [x, y]
}

const abs = Math.abs
let finder: Finder

const checkObstacle = (x1: number, y1: number, x2: number, y2: number, grid: Grid) => {
  if (!grid) throw Error('No grid !')

  const [minX, maxX] = compare(x1, x2)
  const [minY, maxY] = compare(y1, y2)

  const gW = maxX - minX, gH = maxY - minY
  const tx1 = x1 === minX ? 0 : gW,
    ty1 = y1 === minY ? 0 : gH,
    tx2 = x2 === minX ? 0 : gW,
    ty2 = y2 === minY ? 0 : gH

  const myGird = grid as MyGird

  const area = myGird.nodes.filter((el, y) => y <= maxY && y >= minY)
    .map(arr => arr.filter((el, x) => x <= maxX && x >= minX).map(el => el.walkable ? 0 : 1))

  try {
    area[ty2][tx2] = 0
  } catch (error) {
    // area[Math.round(ty2 * 10) / 10][Math.round(tx2 * 10) / 10] = 0
    console.error(ty2, tx2, area)
  }

  // 全通
  const unWalkSize = area.flat().filter(x => x === 1).length
  if (!unWalkSize) {
    return [x2, y2]
  } else {
    // L型
    const [h, w] = compare(abs(x1 - x2), abs(y1 - y2))
    if (h === 1 && w > 2 && unWalkSize === 1) {
      return [x2, y2]
    }

    // 2 * 2 以上的格子，正常寻路
    const temxp = PF.Util.compressPath(finder.findPath(tx1, ty1, tx2, ty2, new PF.Grid(area)))
    if (temxp.length === 0) {
      return [-1, -1]
    }
    return [minX + temxp[1][0], minY + temxp[1][1]]
  }

}

const pos2Point = (p: RoutePos) => ({ x: p.col, y: p.row })

const addRoutes = (route: Route, someMap: SomeMap) => {

  const { height } = someMap.data

  const { startPosition: startPos, endPosition: endPos, checkpoints } = route

  finder = new PF.AStarFinder({
    diagonalMovement: 4,
    weight: Math.min(abs(startPos.col - endPos.col), abs(startPos.row - endPos.row)),
    heuristic:
      function (dx, dy) {
        const { x, y } = route.spawnRandomRange
        if (x > 0 && y > 0) {
          return Math.max(dx * x, dy * (1 + y))
        } else {
          return Math.max(dx, dy)
        }
      }
  })
  const grid = someMap.grid


  const pathPoints = checkpoints.filter(el => el.type < 4 || el.type === 6)
  const path: SimplePathPoint[] = pathPoints.map(el => ({ ...el.position, type: el.type, reachOffset: el.reachOffset }))
  const holeType = path.some(el => el.type === 6)

  path.push(endPos)

  const fly = route.motionMode === 1
  const tempGrid = fly ? new PF.Grid(grid.width, grid.height) : grid.clone()
  tempGrid.setWalkableAt(endPos.col, endPos.row, true)
  // this.traps.forEach(([x, y]) => tempGrid.setWalkableAt(x, y, false))

  let now: SimplePathPoint = startPos

  const splitPath = path.reduce((res, cur, index, arr) => {


    let { col, row } = now
    let nextPos = arr[index]
    let { col: nCol, row: nRow, reachOffset } = nextPos

    // 现在的点是隧道出口，置换位置
    if (nextPos.type === 6) {
      now = cur
      return res
    }
    // 下一个点是空的，且下下个点不是隧道出口，则这个点就是停止点，顺位到下下下个点，因为前面把type5，也就是进隧道的点过滤了，只有出隧道的点。
    if (nCol === 0 && nRow === 0) {
      const time = pathPoints[index].time ? pathPoints[index].time : 0
      // console.log(time, arr[index - 1])
      // if (index === 0) {
      //   console.log(route)
      //   return res
      // }
      // ?出生点停止
      res.push({ stop: { pos: pos2Point(arr[index - 1] || now), time } })
      return res
    }

    let section: SimplePathPoint[] = [now]
    if (fly) section.push(nextPos)

    const isNotNeedFind = route.allowDiagonalMove

    //开始寻路
    if (!fly && !holeType && isNotNeedFind) {
      let [tempCol, tempRow] = [col, row]
      let tempSection: ArrayPoint[] = []

      let dx = abs(nCol - col), dy = abs(nRow - row)
      while ((dx + dy > 1)) {
        [tempCol, tempRow] = checkObstacle(tempCol, tempRow, nCol, nRow, tempGrid)
        if (tempCol > -1 && tempRow > -1) {
          section.push({ col: tempCol, row: tempRow })

        } else {// 区域内找不到路，全图寻路
          if (tempSection.length === 0) {
            const last = PF.Util.compressPath(finder.findPath(col, row, nCol, nRow, tempGrid))
            if (last.length < 1) throw Error('can not find a way to the point')
            tempSection = last.slice(1) as ArrayPoint[]
          }

          [tempCol, tempRow] = tempSection.shift() as ArrayPoint

          if (section.length > 1) {
            // ? 转角处不是下目标点
            while (isSamePoint({ col: tempCol, row: tempRow }, section[section.length - 2])) {
              [tempCol, tempRow] = tempSection.shift() as ArrayPoint
            }
          }
          section.push({ col: tempCol, row: tempRow })
        }
        dx = abs(nCol - tempCol)
        dy = abs(nRow - tempRow)
      }


    }
    // else if (holeType) {
    //   section.push(nextPos)
    // }
    // section.push(nextPos)
    // 终点
    if (!isSamePoint(nextPos, section[section.length - 1])) {
      // console.log(nextPos, section[section.length - 1])
      section.push(nextPos)
    }

    // // //? 擦墙逻辑，如果找不到路
    // // //?但是of1里实际上那个虫子几乎没机会走去出那条路。 
    // if (section.length === 1) {
    //   // section.push(cur)
    //   console.error('something maybe error ')
    //   section.push(nextPos)
    // }

    // 偏移
    section = pArray<SimplePathPoint>(section, 0, mergeReachOffset(now.reachOffset))
    section = pArray<SimplePathPoint>(section, section.length - 1, mergeReachOffset(reachOffset))

    now = cur
    let tempNow = section.shift() as SimplePathPoint
    return section.reduce((res, cur) => {
      const { col, row } = tempNow
      const len = Math.sqrt((col - cur.col) ** 2 + (row - cur.row) ** 2)
      res.push({ points: [pos2Point(tempNow), pos2Point(cur)], time: len * 200 || 10 })
      tempNow = cur
      return res
    }, res)

  }, [] as PFResArr[])

  return splitPath
}

export {
  addRoutes
}
