
var basename = require('path').basename;
var debug = require('debug')('metalsmith-markdown-it');
var dirname = require('path').dirname;
var extname = require('path').extname;
var MarkdownIt = require('markdown-it');
var md;
/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to convert markdown files.
 *
 * @param {Object} options (optional)
 *   @property {Array} keys
 * @return {Function}
 */

function plugin(options){
  if (options instanceof MarkdownIt) {
    md = options;
  } else {
    options = options || {};
    var keys = options.keys || [];
    md = new MarkdownIt(options);
  }
  return function(files, metalsmith, done){

    setImmediate(done);
    Object.keys(files).forEach(function(file){
      debug('checking file: %s', file);
      if (!markdown(file)) return;
      var data = files[file];
      var dir = dirname(file);
      var html = basename(file, extname(file)) + '.html';
      if ('.' != dir) html = dir + '/' + html;

      debug('converting file: %s', file);
      var str = md.render(data.contents.toString());
      data.contents = new Buffer(str);
      keys.forEach(function(key) {
        console.log(key);
        data[key] = md.render(data[key]);
      });

      delete files[file];
      files[html] = data;
    });
  };
}

/**
 * Check if a `file` is markdown.
 *
 * @param {String} file
 * @return {Boolean}
 */

function markdown(file){
  return /\.md|\.markdown/.test(extname(file));
}
