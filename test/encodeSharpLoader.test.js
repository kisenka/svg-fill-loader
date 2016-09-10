require('chai').should();

var path = require('path');
var loader = require('../encodeSharp');
var encodeSharpLoaderPath = require.resolve('../encodeSharp');
var fillLoaderPath = require.resolve('../lib/loader');
var mockContext = require('webpack-toolkit/lib/MockedLoaderContext');
var InMemoryCompiler = require('webpack-toolkit/lib/InMemoryCompiler');

describe('Encode sharp in CSS URLs loader', () => {

  it('should work', function(done) {
    var input = '.a {background: url("./image.svg?fill=#f00")}';
    var expected = '.a {background: url("./image.svg?fill=%23f00")}';

    mockContext().run(loader, input)
      .then(result => {
        result.should.eql(expected);
        done();
      })
      .catch(done);
  });

  it('should work in combination with svg-fill-loader', (done) => {
    var webpackConfig = {
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
              fillLoaderPath
            ]
          }
        ]
      }
    };

    var compiler = new InMemoryCompiler(webpackConfig, {inputFS: true});
    var fs = compiler.inputFS;
    var cssLoaderClientRuntimePath = require.resolve('css-loader/lib/css-base.js');
    var cssLoaderClientRuntimeScript = require('fs').readFileSync(cssLoaderClientRuntimePath).toString();

    fs.write(cssLoaderClientRuntimePath, cssLoaderClientRuntimeScript)
      .then(() => fs.write('styles.css', '.a {background-image: url("./image.svg?fill=#f00");}'))
      .then(() => fs.write('image.svg', '<path />'))
      .then(() => compiler.run())
      .then(compilation => {
        var imageContent = compilation.assets['image.svg'].source().toString();
        imageContent.should.be.eql('<path fill="#f00" />');
        done();
      })
      .catch(done);
  });

});