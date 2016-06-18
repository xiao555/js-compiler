var path = require('path')
var nunjucks = require('nunjucks')
var Metalsmith = require('metalsmith-extended')
var ignore = require('metalsmith-ignore')
var beautify = require('metalsmith-beautify')
var posts = require('metalsmith-posts')
var views = require('metalsmith-views')
var markdown = require('metalsmith-markdown-it')
var nunjucksExtends = require('./nunjucks-extends')
var md = require('./markdown')

require.reload = function reload(path) {
  delete require.cache[require.resolve(path)];
  return require(path);
}

posts = require.reload('metalsmith-posts')
views = require.reload('metalsmith-views')

nunjucksExtends(nunjucks.configure(
  path.join(__dirname, '../views'),
  {
    watch: false,
    noCache: true
  }
));

module.exports = Metalsmith(__dirname + '/../')
  //.metadata(helpers)
  .clean({
    force: true,
    exclude: ['assets']
  })
  .source('./src')
  .destination('./build')
  .use(markdown(md))
  .use(posts())
  .use(views({
    engine: 'nunjucks',
    directory: './views'
  }))
  .use(ignore([
    'scripts/**/**/*',
    'styles/**/**/*',
    'config.yml',
    'helpers.js',
  ]))
  //.use(beautify({
  //  html: true,
  //  preserve_newlines: true,
    //indent_inner_html: true
  //}))
