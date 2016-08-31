var objectAssign = require('object-assign');

/**
 * @param {String} selector
 * @returns {Array<Object>} matcher for posthtml#match
 */
function transformSelectorToMatcher(selector) {
  /**
   * @param {Object} matcher
   * @param {String} attrName
   * @param {String} selector
   */
  function assignAttrCondition(matcher, attrName, selector) {
    if (!matcher.attrs) {
      matcher.attrs = {};
    }

    matcher.attrs[attrName] = selector.substr(1);
  }

  var parts = selector.split(',').map(function(part) {
    var matcher = {};
    var selector = part.trim();
    var firstSymbol = selector.substr(0, 1);

    switch (firstSymbol) {
      case '#':
        assignAttrCondition(matcher, 'id', selector);
        break;

      case '.':
        assignAttrCondition(matcher, 'class', selector);
        break;

      default:
        matcher.tag = selector;
        break;
    }

    return matcher;
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