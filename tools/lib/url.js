var fs = require('fs');
var path = require('path');
var parse = require('url').parse;
var stylus = require('stylus');
var nodes = stylus.nodes;
var Compiler = stylus.Compiler;

function url(options) {
  options = options || {};

  var rootpath = options.root;

  /**
   * @param {object} url - The path to the image you want to encode.
   * @param {object} enc - The encoding for the image. Defaults to base64, the 
   * other valid option is `utf8`.
   */
  function fn(url, enc){
    // Compile the url
    var compiler = new Compiler(url)
      , dirname = path.dirname(url.filename)

    compiler.isURL = true;
    url = url.nodes.map(function(node){
      return compiler.visit(node);
    }).join('');

    // Parse literal
    url = parse(url);

    if (dirname.indexOf(rootpath) !== -1) {
      if ( ! /^\./.test(url.href) && ! fs.existsSync(path.join(dirname, url.href))) {
        url.href = dirname
          .replace(rootpath, '')
          .split(path.sep)
          .map(function(index, elem) {
            return elem === '' ? '' : '../';
          })
          .join('') + url.href;
      }
    }

    return new nodes.Literal('url("' + url.href + '")');

  };

  fn.raw = true;
  return fn;
};

module.exports = function(options) {
  options = options || {};
  return function(style) {
    style.define('url', url(options));
  };
};