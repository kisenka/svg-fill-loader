var objectAssign = require('object-assign');
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

var defaultRenderOptions = {
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
    'use',
    'animateTransform'
  ]
};

/**
 * @param {String} content
 * @param {Object} [options]
 * @returns {Promise<String>}
 */
function process(content, options) {
  options = options || {};
  var renderOptions = objectAssign({}, defaultRenderOptions, options.renderOptions);

  // Dirty hack to autodetect non-single tags
  renderOptions.singleTags = renderOptions.singleTags.filter(function (tag) {
    return content.indexOf('</' + tag + '>') === -1;
  });

  return posthtml([fillPlugin(options)])
    .process(content, {parser: xmlParser})
    .then(function (result) {
      return render(result.tree, renderOptions);
    });
}

module.exports = process;