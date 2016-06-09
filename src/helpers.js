var nunjucks = require('nunjucks')

module.exports = {
  site_asset: function(src) {
    return '/' + src
  },
  rest_url: function(uri) {
    return '?' + uri
  },
  dump: function(vars) {
    return vars;
  },
  site_head: function() {
    return new nunjucks.runtime.markSafe([
      '<base href="/">',
      '<link rel="stylesheet" href="/assets/style.css">',
      '<script src="/assets/jquery.min.js"></script>'
    ].join("\n\r"))
  },
  site_footer: function() {
    return new nunjucks.runtime.markSafe([
      '<script src="/assets/main.js"></script>'
    ].join("\n\r"))
  },
  site_url: function(src) {
    return src ? src + '/index.html' : 'home/index.html'
  }
}
