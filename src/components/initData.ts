import { Notification } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// import { default as testData } from './otherdata.json'
// import { default as testData } from './mapdata.json'
// import { default as testData } from './newdata.json'
import { default as testData } from './d616.json'
import { ElNotificationComponent } from 'element-ui/types/notification'
import MapCube from 'SomeMap/Sharp/MapCube'
import { MapData, Tiles } from 'SomeMap/data/mapdata'
import { default as predata } from './m616predata.json'
const { mapData, routes } = testData
const mapdata: MapData = Object.assign({}, mapData)

let noti: Noti, notiTime: number
const notiStayTime: number = 3000
const hitCubes: Set<MapCube> = new Set()

interface Noti extends ElNotificationComponent {
  closed: boolean
  message: string
  title: string
}

predata.forEach(e => {
  const tIndex = e.position.col + e.position.row * mapData.width
  const target = mapData.tiles[tIndex] as Tiles
  target.extra = {
    name: e.name,
    description: e.description || '没有说明？',
    color: [123, 213, 111, 0.3],
  }
})

mapdata.tiles.forEach((e) => {
  e.events = {
    click: [
      (cube: MapCube) => {
        notiTime = +new Date()
        hitCubes.forEach(e => e.restore())
        hitCubes.clear()
        hitCubes.add(cube)
        if (!noti || noti.closed) {
          noti = Notification({
            title: cube.tileInfo.name,
            message: `${cube.tileInfo.description}`,
            duration: 0,
            onClose: () => {
              hitCubes.forEach(cube => {
                if (cube.backUpAttr.state.changed) {
                  console.log("back")
                  cube.restore()
                } else {
                  console.log('has back')
                }
              })
              cube.update()
            }
          }) as Noti
        } else {
          noti.closed = false
          noti.message = `${cube.tileInfo.description}`
          noti.title = cube.tileInfo.name
        }
        setTimeout(() => {
          if (+ new Date - notiTime > notiStayTime) {
            noti.close()
          }
        }, notiStayTime)

      }
    ]
  }

})

import SomeMap from '@/../SomeMap'

export {
  mapData,
  routes,
  SomeMap
}
