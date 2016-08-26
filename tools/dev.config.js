var path                = require('path')
var webpack             = require('webpack')
var BrowserSyncPlugin   = require('browser-sync-webpack-plugin')
var webpackConfigExtend = require('webpack-config-extend')

module.exports = webpackConfigExtend(require('./base.config'), {
  debug: true,
  watch: true,
  separateStylesheet: true,
  devtool: 'source-map',
  /*
  devServer: {
    //publicPath: 'http://localhost:8080/build/',
    hot: true,
    host: 'localhost',
    port: 8091,
    historyApiFallback: true,
    stats: {
      colors: true
    }
  },
  */
  plugins: [
   // HotModuleReplacementPlugin is autoloaded
    new BrowserSyncPlugin(
      require('./bs.options'),
      // plugin options 
      {
        // prevent BrowserSync from reloading the page 
        // and let Webpack Dev Server take care of this 
        reload: false
    }),
  ]
});
