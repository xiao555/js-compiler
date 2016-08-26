var path                = require('path');
var webpack             = require("webpack");
var webpackConfigExtend = require('webpack-config-extend');
var CleanWebpackPlugin  = require('clean-webpack-plugin');
var CopyWebpackPlugin   = require('copy-webpack-plugin');
var metalsmith          = require('./metalsmith')

var dist = path.join(__dirname, '../');

var uglify = false;

function Build() {}

Build.prototype.apply = function () {
  metalsmith.build(function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('Site build complete!')
    }
  });
}

var config = {
  //devtool: 'source-map',
  separateStylesheet: true,

  output: {
    path: path.join(dist, 'build/assets'),
  },

  plugins: [
    new CleanWebpackPlugin([
        'build', 
      ], {
      root: dist,
      verbose: true,
      dry: false
    }),

    new Build(),

    //new CopyWebpackPlugin([
      //{ from: 'views', to: path.join(dist, 'back-end/views') },
    //  { from: 'src/assets', to: path.join(dist, 'assets') },
    //]),
    // this allows uglify to strip all warnings
    // from Vue.js source code.
    
  ]
}

if (uglify) {
  config.loaders = {
    styling: {
      'css': 'css-loader?' + JSON.stringify({sourceMap: true, discardComments: {removeAll: true}}),
      'less': 'less-loader',
      'styl': 'stylus-loader?sourceMap',
      'scss|sass': 'sass-loader'
    },
  }
  config.plugins = config.plugins.concat([
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
  ])
} else {
  config.devtool = 'source-map'
}

module.exports = webpackConfigExtend(require('./base.config'), config);
