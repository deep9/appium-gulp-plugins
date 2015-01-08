"use strict";
var to5 = require('gulp-6to5'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    _ = require('lodash');

var TRANSPILE_OPTS = {
  //asyncFunctions: true,
  //blockBinding: true,
  //modules: 'commonjs',
  //annotations: true,
  //arrayComprehension: true,
  experimental: true,
  sourceMap: 'inline',
};

var HEADER =
  '/*# sourceMappingURL=path/to/source.map*/\n' +
  'require(\'appium-transpile-runtime\');\n';

var renameEsX =  function () {
  return rename(function (path) {
    path.basename = path.basename.replace(/\.es[67]$/, '');
  });
};

module.exports = function (opts) {
  opts =opts || {};
  this.opts = _.clone(TRANSPILE_OPTS);
  // for backward compatibility
  this.traceurOpts = this.opts;
  this.header = HEADER;
  this.stream = function () {
    var stream = replace(/\/\/\s+transpile:(main|mocha)\s*/g, this.header);
    if (opts['rtts-assert']) stream.pipe(replace(/\/\*(:\w+)\*\//g,'$1'));
    stream.pipe(to5(this.opts));
    stream.pipe(renameEsX());
    return stream;
  }.bind(this);
};

