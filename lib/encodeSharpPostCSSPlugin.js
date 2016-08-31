var postcss = require('postcss');
var helpers = require('postcss-helpers');

module.exports = postcss.plugin('encode-sharp-in-query-string-param-values', function (options) {
  return function (root) {
    root.walkDecls(function (decl) {
      var helper = helpers.createUrlsHelper(decl.value);

      if (!helper.URIS)
        return;

      helper.URIS.forEach(function (url) {
        var href = url.href();
        var hasQuery = href.lastIndexOf('?') > 0;
        var query = hasQuery ? href.substring(href.lastIndexOf('?') + 1) : null;

        if (query !== null && query.length) {
          var params = query.split('&');
          var newQuery = params
            .map(function (paramPair) {
              var isShouldUpdateParam = paramPair.indexOf('=') > 0;
              return isShouldUpdateParam ? paramPair.replace(/#/g, '%23') : paramPair;
            })
            .join('&');

          url.href(href.replace(query, newQuery));
        }
      });

      decl.value = helper.getModifiedRule();
    });
  };
});
