import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';


export default {
  input: 'src/appcrit.js',
  output: {
    file: 'js/appcrit.js',
    format: 'iife',
    name: 'appcrit',
    sourcemap: false,
  },

  plugins: [
    babel({exclude: 'node_modules/**', 
      "presets": [
        ["env", {
          "modules": false,
          "targets": {
            "chrome": 65,
            "safari": 11,
            "firefox": 60
          }
        }]
      ]}),
    terser()
  ]
}
