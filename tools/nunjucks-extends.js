var nunjucks = require('nunjucks')
var md = require('./markdown')

module.exports = function (env) {

  env.addGlobal('parent', function() {
    return
  })

  env.addGlobal('include', function(layout, data, others) {
    //console.log(others.ignore_missing)
    return new nunjucks.runtime.markSafe(nunjucks.render(layout, data||{}));
  })

  env.addFilter('md', function(data) {
    return new nunjucks.runtime.markSafe(md.render(data));
  })

  env.addFilter('markdown', function(data) {
    return new nunjucks.runtime.markSafe(md.render(data));
  })

  env.addGlobal('site_asset', function(src) {
    return src
  })

  env.addGlobal('site_url', function(src) {
    return src
  })

  env.addGlobal('asset_url', function(src) {
    return src
  })

  env.addGlobal('rest_url', function(src) {
    return src
  })

  env.addGlobal('site_head', function() {
    return new nunjucks.runtime.markSafe([
      '<base href="/">',
      '<link rel="stylesheet" href="assets/style.css">',
      '<script src="assets/jquery.min.js"></script>'
    ].join("\n\r"))
  })

  env.addGlobal('site_footer', function() {
    return new nunjucks.runtime.markSafe([
      '<script src="assets/main.js"></script>'
    ].join("\n\r"))
  })

}