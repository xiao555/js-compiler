var nib                 = require('nib');
var path                = require('path');
var webpack             = require('webpack');
var poststylus          = require('poststylus');
var stylusUrl           = require('stylus-url');

// http://webpack.github.io/docs/configuration.html

var paths = {
  root: path.join(__dirname, '../'),
  src: path.join(__dirname, '../src/'),
  scripts: path.join(__dirname, '../src/scripts'),
  styles: path.join(__dirname, '../src/styles'),
  assets: path.join(__dirname, '../src/assets'),
}

module.exports = {
  context: paths.root,
  entry: {
    style: 'styles', // alias, realpath is ./src/styles/index.js
    main: 'scripts', // alias, realpath is ./src/scripts/index.js
  },
  output: {
    path: 'build/assets',
    css: '[name].css',
    js: '[name].js',
  },
  loaders: {
    'js': {
      loader: 'babel',
      //include: path.join(__dirname, '../../'),
      //loader: 'babel-loader',
      exclude: /node_modules|vue\/dist|vue-hot-reload-api|vue-loader/,
      query: {compact: false}
    },
    'vue': 'vue-loader',
    'json': 'json-loader',
    //'coffee': 'coffee-redux-loader',
    'json5': 'json5-loader',
    'txt': 'raw-loader',
    'png|jpg|jpeg|gif|svg': 'file-loader?name=static/[hash].[ext]',
    'woff|woff2': 'file-loader?name=static/[hash].[ext]',
    'ttf|eot|otf': 'file-loader?name=static/[hash].[ext]',

    styling: {
      'css': 'css-loader?sourceMap',
      'less': 'less-loader?sourceMap',
      'styl': 'stylus-loader?sourceMap',
      'scss|sass': 'sass-loader?sourceMap'
    },

    original: [
      { test: /imagesloaded|jquery-bridget/, loader: 'imports?define=>false' },
      { test: /wowjs/, loader: 'imports?this=>window'}
    ]
  },
  externals: {
    jquery: 'jQuery',
    //underscore: '_',
    window: 'window',
    document: 'document'
  },
  resolve: {
    //root: path.join(__dirname, '../../'),
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.es6.js', '.js', '.vue'],
    alias: {
      'assets': paths.assets,
      'styles': paths.styles,
      'scripts': paths.scripts,
      'masonry': 'masonry-layout',
      'isotope': 'isotope-layout',
    }
  },
  resolveLoader: {
    alias: {
      'copy': 'file-loader?name=[name].[ext]', //&context=./src
    }
  },
  // User Custom Config
  stylus: {
    use: [
      //nib(),
      stylusUrl({
        root: paths.src
      }),
      poststylus([ 'autoprefixer', 'lost' ]),
    ],
    import: [
      '~nib/lib/nib/index.styl',
      path.join(paths.styles, 'stylus/variables.styl')
    ]
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
  ]
}
