<template>
  <div class="hello">
    <div class="top">
      <div class="theta-controller" style="z-index: 10">
        <label for="theta">Theta</label>
        <input @input="updateTheta" id="theta" v-model="t" type="range" :min="0" :max="180" />
        <span>{{t}}</span>
      </div>
      <div class="theta-controller" style="z-index: 10">
        <label for="perspective">PERSPECTIVE</label>
        <input
          @input="updatePerspective"
          id="theta"
          v-model="p"
          type="range"
          :min="1000"
          :max="9000"
        />
        <span>{{p}}</span>
      </div>
    </div>
    <div class="canvas-wrapper">
      <canvas style="z-index: 10" :width="cWidth" :height="cHeight" ref="map"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { mapData, routes, SomeMap } from "./initData"

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string
  t: number = 140;
  p: number = 3000;
  someMap: any
  cWidth: number = 1600;
  cHeight: number = 900;
  inited: boolean = false;

  constructor() {
    super()
    console.log(this.t)
  }

  updateTheta() {
    this.someMap.setPerspective({ theta: this.theta * 2 })
  }
  updatePerspective() {
    this.someMap.setPerspective({ perspective: { PERSPECTIVE: +this.p } })
  }
  get theta() {
    console.log("theta", this.t)
    return (this.t / 360) * Math.PI
  }

  async mounted(): Promise<void> {
    const resize = () => {
      console.log("resize")
      // const { innerWidth, innerHeight } = window
      // this.cWidth = innerWidth
      // this.cHeight = innerHeight
      const instance = this.someMap
      instance.config(this.$refs.map, this.p, this.theta * 2)
      instance.init(mapData, routes)
      instance.startLoop()
    }


    await this.$nextTick()
    this.someMap = new SomeMap(
      this.$refs.map as HTMLCanvasElement,
      this.theta * 2,
      this.p,
      mapData,
      routes
    )


    addEventListener("resize", resize)
    resize()
    const delay = (func: Function, time: number) => {
      setTimeout(() => {
        func()
      }, time)
    }
    for (let i = 0; i < 30; i++) {
      delay(() => {
        this.someMap.loopRoutes()
      }, i * 1000)
    }

  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.hello {
  margin: 0 auto
  //max-width: 1200px
  //height: calc(100vh - 60px)
  background-color: rgba(230, 25, 144, 0.3)
  display: grid
  grid-template-columns: 1000px 570px 1fr
  grid-template-rows: auto 1fr
  grid-gap: 20px 50px
}

.top {
  grid-row: 1 / 2
  grid-column: 1 / 2
}

.theta-controller {
  z-index: 10
  align-items: center
  margin: 0 auto
  width: fit-content
}

.canvas-wrapper {
  position: relative
  width: 1000px
  height: 580px
  grid-row: 2 / 3
  grid-column: 1 / 2
  background-color: rgba(24, 230, 144, 0.3)

  canvas {
    position: absolute
    left: -10%
    top: -10%
    width: 120%
    height: 120%
  }
}

@media screen and (max-width: 700px) {
  .hello {
    margin: 0 auto
    //max-width: 1200px
    //height: calc(100vh - 60px)
    background-color: rgba(230, 25, 144, 0.3)
    display: grid
    grid-template-columns: 1fr
    grid-template-rows: auto 1fr
    grid-gap: 20px 50px
  }

  .canvas-wrapper {
    grid-row: 2 / 3
    width: 100vw
    height: 56vw
  }
}
</style>
