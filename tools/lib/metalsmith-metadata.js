var _ = require('lodash');
var path = require('path');
var Matcher = require('minimatch').Minimatch;
var extend = require('extend');
var camelCase = require('camel-case');

module.exports = plugin;

function plugin(opts) {

  return function(files, metalsmith, done) {
    var id = 0;
    var metadata = metalsmith.metadata();
    metadata.posts = metadata.posts || {}
    metadata.posts.indexes = metadata.posts.indexes || {}
    Object.keys(files).forEach(function(file){
      if (/^globals(\/|\\)(.*)\.html/.test(file)) {
        var fileInfo = path.parse(file);
        var parts = fileInfo.dir.split(/\/|\\/);
        metadata.globals = metadata.globals || {}
        metadata.globals.index = metadata.globals.index || {}
        recompose( parts, {key: fileInfo.name, val: files[file]}, metadata );
        metadata.globals = extend(true, metadata.globals.index, metadata.globals);
      } else if (/^posts(\/|\\)(.*)\.html/.test(file)) {
          var data = files[file]
          //var fileInfo = path.parse(file);
          data.id = ++id
          link = file.replace(/^posts(\/|\\)/g, '')
          var fileInfo = path.parse(link);
          //console.log(fileInfo)
          //data.src = fileInfo.dir||fileInfo.name
          //console.log(link);
          if (Object.keys(data).indexOf('link') === -1) {
            data.link = link
          }
          if (fileInfo.name == 'index') {
            metadata.posts.indexes[fileInfo.dir||fileInfo.name] = data
          } else {
            if (fileInfo.dir === '') {
              metadata.posts[fileInfo.name] = data;
            } else {
              metadata.posts[fileInfo.dir] = metadata.posts[fileInfo.dir] || []
              if (Object.prototype.toString.call( metadata.posts[fileInfo.dir] ) !== '[object Array]') {
                metadata.posts.indexes[fileInfo.dir] = metadata.posts[fileInfo.dir]
                metadata.posts[fileInfo.dir] = []
              }
              metadata.posts[fileInfo.dir].push(data)
            }
          }
          files[link] = data
      }
      delete files[file];
    })
    Object.keys(metadata.posts.indexes).forEach(function(index){
      if (typeof metadata.posts[index] !== 'undefined') {
        var data = metadata.posts.indexes[index]
        data.children = _.sortBy(metadata.posts[index], function(post) {
          return post[data.sortBy || 'id'] || post.id
        })
        metadata.posts.indexes[index] = data
      }
    });
    //console.log(metadata.globals);
    //Object.keys(files).forEach(function(file){
      //console.log(file);
    //})
    done();
  }
}

function recompose(keys, data, metadata) {
  if (data.key == 'index') {
    //return
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
