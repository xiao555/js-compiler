var path                = require('path');
var webpack             = require("webpack");
var CleanWebpackPlugin  = require('clean-webpack-plugin')
var ExtractTextPlugin   = require("extract-text-webpack-plugin");
var webpackConfigExtend = require('webpack-config-extend')

module.exports = webpackConfigExtend(require('./base.config'), {
  //devtool: 'source-map',
  separateStylesheet: true,
  vue:{
    loaders: {
      css: ExtractTextPlugin.extract('css-loader'),
      stylus: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')
    }
  },
  plugins: [
    new CleanWebpackPlugin(['build'], {
      root: path.join(__dirname, '../'),
      verbose: true, 
      dry: false
    }),
    // this allows uglify to strip all warnings
    // from Vue.js source code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // This minifies not only JavaScript, but also
    // the templates (with html-minifier) and CSS (with cssnano)!
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      },
      output: {
        comments: false
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
})