var webpack = require('webpack');
var MemoryFileSystem = require('memory-fs');

/**
 * @param {WebpackConfig} config
 * @param {boolean} [inputFS=false] Input filesystem
 * @param {boolean} [outputFS=true] Output filesystem
 * @returns {Compiler}
 */
function inMemoryCompiler(config, inputFS, outputFS) {
  var input = typeof inputFS === 'boolean' ? inputFS : false;
  var output = typeof outputFS === 'boolean' ? outputFS : true;
  if (!input && !output)
    throw new Error('In-memory input or output (or both) filesystem should be true');

  var compiler = webpack(config);
  var fs = new MemoryFileSystem();

  if (input) {
    /** @type {MemoryFileSystem} */
    compiler.inputFileSystem = fs;
    compiler.resolvers.normal.fileSystem = fs;
    compiler.resolvers.context.fileSystem = fs;
  }

  if (output) {
    /** @type {MemoryFileSystem} */
    compiler.outputFileSystem = fs;
  }

  return compiler;
}

module.exports = inMemoryCompiler;