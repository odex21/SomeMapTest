<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="theta-controller" style="z-index: 10">
      <label for="theta">Theta</label>
      <input @input="updateTheta" id="theta" v-model="t" type="range" :min="0" :max="180" />
      <span>{{t}}</span>
    </div>
    <div class="theta-controller" style="z-index: 10">
      <label for="perspective">PERSPECTIVE</label>
      <input @input="updatePerspective" id="theta" v-model="p" type="range" :min="1000" :max="9000" />
      <span>{{p}}</span>
    </div>
    <canvas style="z-index: -2" :width="cWidth" :height="cHeight" ref="map"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { mapData, routes, SomeMap } from "./initData"

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
  t: number = 140;
  p: number = 3000;
  someMap: any;
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
      const { innerWidth, innerHeight } = window
      this.cWidth = innerWidth
      this.cHeight = innerHeight
    }

    resize()

    await this.$nextTick()
    this.someMap = new SomeMap(
      this.$refs.map as HTMLCanvasElement,
      this.theta * 2,
      this.p,
      mapData,
      routes
    )

    // requestAnimationFrame(() => {
    //   this.someMap.draw()
    // })

    addEventListener("resize", resize)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.theta-controller {
  z-index: 10
  display: flex
  align-items: center
  margin: 0 auto
  width: fit-content
}

canvas {
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 50vh
}
</style>
