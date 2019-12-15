import { Notification } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import { default as testData } from './mapdata.json'
import { ElNotificationComponent } from 'element-ui/types/notification'
import MapCube from 'SomeMap/Sharp/MapCube'
import { MapData } from 'SomeMap/data/mapdata'
const { mapData, routes } = testData
const mapdata: MapData = Object.assign({}, mapData)

let noti: Noti, notiTime: number
const notiStayTime: number = 3000
const hitCubes: MapCube[] = []

interface Noti extends ElNotificationComponent {
  closed: boolean
  message: string
  title: string
}

mapdata.tiles.forEach((e) => {
  e.events = {
    click: [
      (cube: MapCube) => {
        notiTime = +new Date()
        hitCubes.push(cube)
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
