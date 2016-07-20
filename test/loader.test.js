require('chai').should();
var inMemoryCompiler = require('./test-utils/inMemoryCompiler');
var mergeWebpackConfig = require('webpack-config-merger');

function createCompiler(config, inputFS, outputFS) {
  var defaultConfig = {
    context: '/',
    output: {
      filename: '[name].js',
      path: '/build'
    }
  };

  var compiler = inMemoryCompiler(
    mergeWebpackConfig(defaultConfig, config || {}),
    typeof inputFS === 'boolean' ? inputFS : true,
    typeof outputFS === 'boolean' ? outputFS : true
  );

  return compiler;
}

describe('Fill loader', function() {

  it('test', function (done) {
    var compiler = createCompiler({
      entry: 'entry'
    });

    compiler.inputFileSystem.writeFileSync('/entry.js', 'console.log(123)');

    compiler.run(function (err, stats) {
      debugger;
    });
  });
});