var chai = require('chai');
var sinon = require('sinon');
chai.should();
chai.use(require('sinon-chai'));

var loader = require('../lib/loader');
var createMockedContext = require('./test-utils/createMockedContext');

/**
 * @param {String} content
 * @param {Object} context
 * @returns {Promise}
 */
function runWithMockedContext(content, context) {
  var context = createMockedContext(context);
  loader.call(context, content);
  return context._promise;
}

describe('Fill loader', function() {

  it('should be cacheable', function (done) {
    var spy = sinon.spy(function() { return true });

    runWithMockedContext('', { cacheable: spy })
      .then(function () {
        spy.should.have.been.calledOnce;
        done();
      });
  });

  it('`raw` option is false by default', function(done) {
    runWithMockedContext('<svg></svg>', {query: ''})
      .then(function(result) {
        result.should.contain('module.exports');
        done();
      });
  });

  it('should handle `raw` option properly', function(done) {
    runWithMockedContext('<svg></svg>', {query: '?raw=true'})
      .then(function(result) {
        result.should.not.contain('module.exports');
        done();
      });
  });

});