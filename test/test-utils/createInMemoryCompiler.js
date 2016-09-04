var InMemoryCompiler = require('webpack-toolkit/lib/InMemoryCompiler');
var mergeWebpackConfig = require('webpack-config-merger');

/**
 * @param {WebpackConfig} config
 * @param {Boolean} inputFS
 * @param {Boolean} outputFS
 * @returns {InMemoryCompiler}
 */
function createCompiler(config, inputFS, outputFS) {
  var defaultConfig = {
    context: '/',
    output: {
      filename: '[name].js',
      path: '/build'
    }
  };

  return new InMemoryCompiler(
    mergeWebpackConfig(defaultConfig, config || {}),
    inputFS,
    outputFS
  );
}

module.exports = createCompiler;