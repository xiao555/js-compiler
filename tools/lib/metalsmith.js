var fs = require('fs')
var is = require('is')
var path = require('path')
var assert = require('assert')
var unyield = require('unyield')
var rimraf = require('rimraf')
var thunkify = require('thunkify')
var Metalsmith = require('metalsmith')

rm = thunkify(rimraf);

Metalsmith.prototype.clean = function(clean){
  if (!arguments.length) return this._clean;
  assert(is.boolean(clean) || is.object(clean), 'You must pass boolean or object.');
  this._clean = clean
  return this;
}

Metalsmith.prototype.build = unyield(function*(){
  var clean = this.clean();
  var dest = this.destination();
  if (is.boolean(clean) || is.object(clean)) {
    var contents = fs.readdirSync(dest);
    for (var i = 0; i < contents.length; i++) {
      var f = contents[i];
      if (clean.exclude.indexOf(f) === -1) yield rm(path.join(dest, f));
    }
  }
  var files = yield this.read();
  files = yield this.run(files);
  yield this.write(files);
  return files;
})

module.exports = Metalsmith
