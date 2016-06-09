var path = require('path');
var Matcher = require('minimatch').Minimatch;
var extend = require('extend');
var camelCase = require('camel-case');

module.exports = plugin;

function plugin(opts) {

  var id = 0;

  return function(files, metalsmith, done) {
    var metadata = metalsmith.metadata();
    Object.keys(files).forEach(function(file){
      if (/(.*)\.html/.test(file)) {
        var data = files[file]
        var fileInfo = path.parse(file);
        var parts = fileInfo.dir.split(/\/|\\/);
        recompose( parts, {key: fileInfo.name, val: files[file]}, metadata );
        if (/^posts(\/|\\)(.*)\.html/.test(file)) {
          data.id = ++id
          link = file.replace(/^posts(\/|\\)/g, '')
          //console.log(link);
          if (Object.keys(data).indexOf('link') === -1) {
            data.link = link
          }
          files[link] = data
        }
        delete files[file];
      }
    })
    //console.log(metadata.posts);
    //Object.keys(files).forEach(function(file){
      //console.log(file);
    //})
    done();
  }
}

function recompose(keys, data, metadata) {
  if (data.key == 'index') {
    return
  }
  if (keys.length === 0) {
    return
  }
  var key = keys.shift()
  key = camelCase(key.split(/-|_/).join(' '))
  metadata = metadata || {}
  metadata[key] = metadata[key] || {}
  if (keys.length === 0) {
    metadata[key][data.key] = data.val
  }
  return recompose(keys, data, metadata[key])
}
