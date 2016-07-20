var objectAssign = require('object-assign');
var Promise = require('bluebird');

/**
 * @param {Object} [context]
 * @returns {{
 *  cacheable: Function,
 *  async: Function,
 *  query: String,
 *  reqourceQuery: String
 *  _promise: Promise,
 * }}
 */
function createMockedContext(context) {
  var resolve;
  var reject;
  var donePromise = new Promise(function (res, rej) {
    resolve = res;
    reject = rej;
  });

  var mockedAsync = function () {
    return function (err, result) {
      if (err) {
        reject(err);
      }

      return resolve(result);
    };
  };

  var mockedContext = objectAssign({},
    {
      cacheable: function () { return true },
      async: mockedAsync,
      query: '',
      resourceQuery: '',
      _promise: donePromise
    },
    context || {}
  );

  return mockedContext;
}

module.exports = createMockedContext;