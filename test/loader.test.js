var chai = require('chai');
var sinon = require('sinon');
chai.should();
chai.use(require('sinon-chai'));

var loader = require('../lib/loader');
var parseQuery = loader.parseQuery;
var createFakeContext = require('./test-utils/createFakeLoaderContext');

/**
 * @param {String} content
 * @param {Object} context
 * @returns {Promise}
 */
function runInFakeContext(content, context) {
  var context = createFakeContext(context);
  loader.call(context, content);
  return context._promise;
}

describe('SVG fill loader', function() {

  describe('parseQuery', function () {
    it('should properly parse param values which contains comma', function() {
      parseQuery('?query=a,b').should.eql({
        query: 'a,b'
      });
    });
  });

  it('should be cacheable', function (done) {
    var spy = sinon.spy(function() { return true });

    runInFakeContext('', { cacheable: spy })
      .then(function () {
        spy.should.have.been.calledOnce;
        done();
      })
      .catch(done);
  });

  it('`raw` option is false by default', function(done) {
    runInFakeContext('<svg></svg>', {query: ''})
      .then(function(result) {
        result.should.contain('module.exports');
        done();
      })
      .catch(done);
  });

  it('should handle `raw` option properly', function(done) {
    runInFakeContext('<svg></svg>', {query: '?raw=true'})
      .then(function(result) {
        result.should.not.contain('module.exports');
        done();
      })
      .catch(done);
  });

  it('should allow to configure default options via loader config', function(done) {
    var input = '<path /><circle /><polygon />';
    var expected = '<path fill="red" /><circle fill="red" /><polygon />';

    runInFakeContext(input, {
      query: '?raw&selector=path,circle&fill=red'
    })
      .then(function(result) {
        result.should.eql(expected);
        done();
      })
      .catch(done);
  });

  it('should allow to mix loader config with resource query params', function(done) {
    var input = '<path /><circle />';
    var expected = '<path fill="blue" /><circle />';

    runInFakeContext(input, {
      query: '?raw&selector=path',
      resourceQuery: '?fill=blue'
    })
      .then(function(result) {
        result.should.eql(expected);
        done();
      })
      .catch(done);
  });

});