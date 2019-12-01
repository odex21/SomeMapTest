<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div style="z-index: 10">
      <button @click="minus">-</button>
      <button @click="add">+</button>
    </div>
    <canvas style="z-index: -2" :width="cWidth" :height="cHeight" ref="map"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SomeMap from "@/utils/SomeMap";

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
  t: number;
  someMap: any;
  cWidth: number = 1600;
  cHeight: number = 900;

  constructor() {
    super();
    this.t = -75;
    console.log(this.t);
  }

  add() {
    console.log("???", this.t, this, this.someMap, this.cWidth);
    this.t++;
    console.log("theta", this.t, this.theta);
    this.someMap.theta = this.theta;
  }

  minus() {
    console.log("???");
    this.t--;
    console.log("theta", this.t, this.theta);
    this.someMap.theta = this.theta;
    // this.someMap.theta = this.theta;
  }

  get theta() {
    console.log("theta", this.t);
    return (this.t / 360) * Math.PI;
  }

  async mounted(): Promise<void> {
    const resize = () => {
      const { innerWidth, innerHeight } = window;
      this.cWidth = innerWidth; //parseInt(innerWidth.replace("px", ""));
      this.cHeight = innerHeight; //parseInt(innerHeight.);
    };
    resize();
    await this.$nextTick();
    this.someMap = new SomeMap(this.$refs.map as HTMLCanvasElement);
    requestAnimationFrame(() => {
      this.someMap.draw();
    });

    addEventListener("resize", resize);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
h3 {
  margin: 40px 0 0
}

ul {
  list-style-type: none
  padding: 0
}

li {
  display: inline-block
  margin: 0 10px
}

a {
  color: #42b983
}

canvas {
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
}
</style>
