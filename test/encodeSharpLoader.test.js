require('chai').should();

var path = require('path');
var loader = require('../encodeSharp');
var encodeSharpLoaderPath = require.resolve('../encodeSharp');
var createMockedContext = require('./test-utils/createFakeLoaderContext');
var createCompiler = require('./test-utils/createInMemoryCompiler');
var fillLoaderPath = require.resolve('../lib/loader');

/**
 * @param {String} content
 * @param {Object} context
 * @returns {Promise}
 */
function runWithFakeContext(content, context) {
  var context = createMockedContext(context);
  loader.call(context, content);
  return context._promise;
}

describe('Encode sharp in CSS URLs loader', function () {

  it('should work', function(done) {
    var input = '.a {background: url("./image.svg?fill=#f00")}';
    var expected = '.a {background: url("./image.svg?fill=%23f00")}';

    runWithFakeContext(input)
      .then(function (result) {
        result.should.eql(expected);
        done();
      })
      .catch(done);
  });

  it('should work in combination with svg-fill-loader', function(done) {
    var webpackConfig = {
      context: path.resolve(__dirname, 'fixtures/encodeSharpLoader'),
      entry: './styles.css',
      module: {
        loaders: [
          {
            test: /\.css$/,
            loaders: [
              'css-loader',
              encodeSharpLoaderPath
            ]
          },

          {
            test: /\.svg/,
            loaders: [
              'file-loader?name=[name].[ext]',
              fillLoaderPath + '?raw'
            ]
          }
        ]
      }
    };

    var compiler = createCompiler(webpackConfig, false);

    compiler.run()
      .then(function(compilation) {
        var imageContent = compilation.assets['image.svg'].source().toString();
        imageContent.should.be.eql('<path fill="#f00" />');
        done();
      })
      .catch(done);
  });

});