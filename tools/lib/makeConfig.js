var _ = require('lodash')
var path                    = require("path");
var webpack                 = require("webpack");
var ExtractTextPlugin       = require("extract-text-webpack-plugin");
var loadersByExtension      = require("./loadersByExtension");
var baseConfig              = require('../base.config');

function makeLoaders(loaders, separateStylesheet) {
  var styling, original, cssLoaders, stylesheetLoader;

  styling = loaders.styling
  original = loaders.original
  cssLoaders = styling.css || 'css-loader'

  Object.keys(styling).forEach(function(ext) {
    stylesheetLoader = styling[ext];
    if (ext != 'css') {
      if(Array.isArray(stylesheetLoader)) {
        stylesheetLoader.push(cssLoaders);
      } else {
        stylesheetLoader = [cssLoaders, stylesheetLoader]
      }
    }
    if(Array.isArray(stylesheetLoader)) stylesheetLoader = stylesheetLoader.join('!');
    if(separateStylesheet) {
      styling[ext] = ExtractTextPlugin.extract('style-loader', stylesheetLoader);
    } else {
      styling[ext] = 'style-loader!' + stylesheetLoader;
    }
  });

  delete loaders.styling
  delete loaders.additional

  return [].concat(loadersByExtension(loaders))
    .concat(loadersByExtension(styling))
    .concat(original)
}

module.exports = function (options) {
  var config = baseConfig, 
    loaders, 
    devServer, 
    plugins,
    separateStylesheet;

  devServer = _.extend(config.devServer || {}, options.devServer)
  plugins = [].concat(config.plugins || []).concat(options.plugins)
  separateStylesheet = options.separateStylesheet && devServer.hot !== true
  loaders = makeLoaders(_.extend(config.loaders || {}, options.loaders || {}), separateStylesheet)

  if(separateStylesheet) {
    plugins.push(new ExtractTextPlugin(config.output.css));
  }

  if (_.size(devServer) !== 0) {
    var host = devServer.host || 'localhost'
    var port = devServer.port || 8080
    var publicPath = devServer.publicPath || 'http://'+host+':'+port+'/build/'
    config.output.publicPath = publicPath
    devServer.publicPath = publicPath
    for(var key in config.entry) {
      if (typeof config.entry[key] === 'string' || config.entry[key] instanceof String) {
        config.entry[key] = [config.entry[key]]
      }
      config.entry[key].unshift('webpack-dev-server/client?http://' + host + ':' + port, 'webpack/hot/dev-server');
    }
    if (devServer.hot === true) {
      plugins.push(new webpack.HotModuleReplacementPlugin())
    }
    config.devServer = devServer
  }

  config.module = config.module || {}
  config.module.loaders = loaders
  config.plugins = plugins
  config.output.filename = config.output.js

  delete config.output.css
  delete config.output.js
  delete options.separateStylesheet
  delete options.loaders
  delete options.devServer
  delete options.plugins

  //console.log(config)
  return _.extend(config, options);
};
