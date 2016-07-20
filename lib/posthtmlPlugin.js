var objectAssign = require('object-assign');

/**
 * @param {String} selector
 * @returns {Array<Object>} matcher for posthtml#match
 */
function transformSelectorToMatcher(selector) {
  var parts = selector.split(',').map(function(part) {
    return {tag: part.trim()};
  });
  return parts;
}

var defaultOptions = {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Element#Graphics_elements
   */
  selector: [
    'circle',
    'ellipse',
    'line',
    'path',
    'polygon',
    'polyline',
    'rect',
    'text',
    'use'
  ].join(',')
};

module.exports = function(opts) {
  var options = objectAssign({}, defaultOptions, opts || {});
  var fill = options.fill || null;
  var matcher = transformSelectorToMatcher(options.selector);

  return function(tree, done) {
    tree.match(matcher, function (node) {
      if (fill) {
        if (!node.attrs) node.attrs = {};
        node.attrs.fill = fill;
      }
      return node;
    });

    done(null, tree);
  }
};

module.exports.defaultOptions = defaultOptions;
module.exports.transformSelectorToMatcher = transformSelectorToMatcher;