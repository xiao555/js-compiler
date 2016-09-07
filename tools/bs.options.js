var metalsmith = require('./metalsmith')

require.reload = function reload(path){
  delete require.cache[require.resolve(path)];
  return require(path);
}

module.exports = {
  // BrowserSync options
  server: {
    baseDir: './build',
    directory: true
  },
  //host: 'localhost',
  open: true,
  notify: true,
  port: 4000,
  // proxy the Webpack Dev Server endpoint
  // (which should be serving on http://localhost:3100/)
  // through BrowserSync
  //proxy: 'localhost/equilibrium',
  files: [
    {
      match: ['build/assets/*.js'],
      fn: function (event, file) {
        if (! /style\.js$/.test(file) ) {
          console.log(file);
          this.reload()
        }
      }
    },
    {
      match: [
        'views/**/*',
        'src/assets/**/*',
        'src/globals/**/*',
        'src/posts/**/*',
        '!src/**/*.crdownload',
        'tools/metalsmith.js',
        'tools/nunjucks-extended.js',
        'node_modules/metalsmith-posts/lib/index.js',
        'node_modules/metalsmith-extended/lib/index.js',
      ],
      fn: function (event, file) {
        var bs = this
        if (!bs.paused) {
          bs.pause();
          metalsmith = require.reload('./metalsmith')
          metalsmith.build(function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log('Site build complete!')
              bs.resume();
              bs.reload();
            }
          })
        }
      }
    },
    'build/assets/*.css',
  ],
  /*middleware: [
    function (req, res, next) {
      //console.log(res);
      next()
      if (!metalsmithBuild) {
        metalsmithBuild = true

      } else {
        //next()
      }

    },
  ]*/
}
