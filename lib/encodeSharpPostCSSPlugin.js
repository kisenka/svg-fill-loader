var postcss = require('postcss');
var helpers = require('postcss-helpers');

module.exports = postcss.plugin('encode-sharp-in-query-string-param-values', function (options) {
  return function (root) {
    root.walkDecls(function (decl) {
      var helper = helpers.createUrlsHelper(decl.value);

      if (!helper.URIS)
        return;

      helper.URIS.forEach(function (url) {
        var urlStr = url.toString();
        if (urlStr.indexOf('=#') !== -1) {
          var newQuery = url.query() + encodeURIComponent('#') + url.fragment().replace(/=#/g, '=%23');
          url.query(newQuery);
          url.fragment(null);
        }
      });

      decl.value = helper.getModifiedRule();
    });
  };
});
