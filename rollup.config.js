import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/appcrit.js',
  format: 'iife',
  dest: 'js/appcrit.js',
  sourceMap: false,
  moduleName: 'appcrit',
  plugins: [
    babel({exclude: 'node_modules/**', "presets": ["es2015-rollup"]})  ]
}
