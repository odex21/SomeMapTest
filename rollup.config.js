import { terser } from "rollup-plugin-terser"
import typescript from 'rollup-plugin-typescript2'
import clear from 'rollup-plugin-clear'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const path = 'dist/somemap_'

export default {
  input: 'SomeMap/index.ts',
  output: [
    // { file: `${path}lib.js`, format: 'cjs' },
    // { file: `${path}lib.min.js`, format: 'cjs' },
    // { file: `${path}lib.esm.js`, format: 'es' },
    { file: `dist/index.js`, format: 'es' },
    // { dir: '.', entryFileNames: `${path}lib-[format].js`, format: 'iife' }
  ],
  plugins: [
    clear({
      // required, point out which directories should be clear.
      targets: ['dist'],
      // optional, whether clear the directores when rollup recompile on --watch mode.
      watch: true, // default: false
    }),
    typescript({
      tsconfig: 'tsconfig.build.json'
      // useTsconfigDeclarationDir: true
    }),
    commonjs(),
    // resolve(),
    terser({
      // include: [/^.+\.min\.js$/, '*esm*'],
      // exclude: ['some*']
    }),


  ]
}
