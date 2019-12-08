import { terser } from "rollup-plugin-terser"
import typescript from 'rollup-plugin-typescript2'

const path = 'dist/somemap_'

export default {
  input: 'src/utils/SomeMap/index.ts',
  output: [
    { file: `${path}lib.js`, format: 'cjs' },
    { file: `${path}lib.min.js`, format: 'cjs' },
    { file: `${path}lib.esm.js`, format: 'es' },
    { dir: '.', entryFileNames: `${path}lib-[format].js`, format: 'iife' }
  ],
  plugins: [
    terser({
      // include: [/^.+\.min\.js$/, '*esm*'],
      // exclude: ['some*']
    }),
    typescript()
  ]
}
