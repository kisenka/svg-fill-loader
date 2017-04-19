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

  /**
   * Workaround for Webpack bug when it misses resource query in aliased loader
   * @see https://github.com/webpack/webpack/issues/1289
   * @see https://github.com/webpack/webpack/issues/1513
   * @see https://github.com/webpack/webpack/issues/3320
   */
  if (Object.keys(query).length === 0 && this._module) {
    var rawRequest = this._module.rawRequest;
    var queryMarkPos = rawRequest.indexOf('?');

    if (queryMarkPos !== -1) {
      query = parseQuery(rawRequest.substr(queryMarkPos));
    }
  }

  if (!totalConfig.fill) {
    var result = totalConfig.raw ? content : 'module.exports = ' + JSON.stringify(content);
    return done(null, result);
  }

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