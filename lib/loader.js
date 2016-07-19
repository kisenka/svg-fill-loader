var objectAssign = require('object-assign');
var loaderUtils = require('loader-utils');
var process = require('./process');

var defaultConfig = {
  raw: false
};

module.exports = function(content) {
  this.cacheable && this.cacheable();
  var done = this.async();
  var config = objectAssign({}, defaultConfig, loaderUtils.parseQuery(this.query));
  var query = loaderUtils.parseQuery(this.resourceQuery);

  process(content, query)
    .then(function (res) {
      var result = config.raw
        ? res
        : 'module.exports = ' + JSON.stringify(res);
      done(null, result);
    })
    .catch(done);
};