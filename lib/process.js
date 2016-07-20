var posthtml = require('posthtml');
var parser = require('posthtml-parser');
var render = require('posthtml-render');
var fillPlugin = require('./posthtmlPlugin');

/**
 * Custom XML parser
 * @see https://github.com/fb55/htmlparser2/wiki/Parser-options
 */
var xmlParser = parser(({
  xmlMode: true,
  lowerCaseTags: false,
  lowerCaseAttributeNames: false
}));

var renderOptions = {
  closingSingleTag: 'slash',
  /**
   * @see https://github.com/posthtml/posthtml-render#singletags
   */
  singleTags: [
    'circle',
    'ellipse',
    'line',
    'path',
    'polygon',
    'polyline',
    'rect',
    'use'
  ]
};

/**
 * @param {String} content
 * @param {Object} [options]
 * @returns {Promise<String>}
 */
function process(content, options) {
  return posthtml([fillPlugin(options)])
    .process(content, {parser: xmlParser})
    .then(function (result) {
      return render(result.tree, renderOptions);
    });
}

module.exports = process;