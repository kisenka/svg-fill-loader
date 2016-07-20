var objectAssign = require('object-assign');
var loaderUtils = require('loader-utils');
var process = require('./process');

function parseQuery(query) {
  if (!query) {
    return {};
  }

  var encoded = query.replace(',', encodeURIComponent(','));
  return loaderUtils.parseQuery(encoded);
}

var defaultConfig = {
  raw: true
};

module.exports = function(content) {
  this.cacheable && this.cacheable();
  var done = this.async();

  var loaderConfig = objectAssign({}, defaultConfig, parseQuery(this.query));
  var query = parseQuery(this.resourceQuery);
  var totalConfig = objectAssign({}, loaderConfig, query);

  process(content, totalConfig)
    .then(function (res) {
      var result = totalConfig.raw
        ? res
        : 'module.exports = ' + JSON.stringify(res);
      done(null, result);
    })
    .catch(done);
};

module.exports.parseQuery = parseQuery;