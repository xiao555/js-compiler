var path = require('path')
var _ = require('lodash')
var nunjucks = require('nunjucks')
var Metalsmith = require('./lib/metalsmith')
var markdown = require('./markdown')
//var markdown = require('metalsmith-markdown')
var ignore = require('metalsmith-ignore')
var beautify = require('metalsmith-beautify')
var permalinks = require('metalsmith-permalinks');
//var branch = require('metalsmith-branch');
var collections = require('metalsmith-collections')
var metadata = require('./lib/metalsmith-metadata')
var views = require('./lib/metalsmith-views')
var helpers = require('../src/helpers')
var marked = require('marked')

require.reload = function reload(path) {
  delete require.cache[require.resolve(path)];
  return require(path);
}

metadata = require.reload('./lib/metalsmith-metadata')
views = require.reload('./lib/metalsmith-views')

var env = nunjucks.configure(
  path.join(__dirname, '../views'),
  {
    watch: false,
    noCache: true
  }
)

env.addGlobal('parent', function() {
  return
})

env.addGlobal('include', function(layout, data, others) {
  //console.log(others.ignore_missing)
  return new nunjucks.runtime.markSafe(nunjucks.render(layout, data||{}));
})

module.exports = Metalsmith(__dirname + '/../')
  .metadata(helpers)
  .clean({
    force: true,
    exclude: ['assets']
  })
  .source('./src')
  .destination('./build')
  .use(markdown({
    //renderer: new marked.Renderer(),
    html: true,
    breaks: true,
    typographer: true,
  }))
  .use(metadata())
  .use(collections({
    home: {
      pattern: 'posts/home/*.md',
      //sortBy: 'order',
      //reverse: true
    }
  }))
  /*
  .use(
    permalinks({
      pattern: ':title',
    })
  )
  .use(collections({
    home: {
      pattern: 'posts/home/*.md',
      sortBy: 'order',
      //reverse: true
    }
  }))
  .use(
    branch( ['posts/*', '!posts/home.html'] )
      .use(
        permalinks({
          pattern: ':title',
        })
      )
  )
  .use(
    branch( ['posts/index.html'] )
      .use(
        permalinks({
          pattern: 'home',
        })
      )
  )
  .use(renamer({
    filesToRename: {
      pattern: 'posts/home.md',
      rename: 'index.md'
    }
  }))
  .use(permalinks({
      pattern: ':rootName/:pageName',
      // original options would act as the keys of a `default` linkset,
      //pattern: ':title',
      //date: 'YYYY',
      // each linkset defines a match, and any other desired option
     linksets: [{
          match: { collection: 'news' },
          pattern: ':rootName/news/:pageName',
          date: 'mmddyy'
      },{
          match: { collection: 'projects' },
          pattern: ':rootName/projects/:pageName'
      }]
  }))
  */
  //.use(twig())
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
