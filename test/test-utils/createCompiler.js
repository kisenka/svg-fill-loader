var InMemoryCompiler = require('./test-utils/inMemoryCompiler');
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
      filename: 'entry.js',
      path: '/build'
    }
  };

  return new InMemoryCompiler(
    mergeWebpackConfig(defaultConfig, config || {}),
    typeof inputFS === 'boolean' ? inputFS : true,
    typeof outputFS === 'boolean' ? outputFS : true
  );
}

module.exports = createCompiler;