require('chai').should();
var sprintf = require('util').format;
var process = require('../lib/process');
var plugin = require('../lib/posthtmlPlugin');
var transformSelectorToMatcher = plugin.transformSelectorToMatcher;

function test(name, options, input, expected) {
  it(name, function (done) {
    process(input, options).then(function (result) {
      result.should.be.eql(expected);
      done();
    })
    .catch(done);
  })
}

describe('Selector transformer', function() {
  it('should support single tag selector', function () {
    transformSelectorToMatcher('path').should.be.eql([ {tag: 'path'} ]);
  });

  it('should support tag selectors separated by comma', function () {
    transformSelectorToMatcher('circle,path').should.be.eql([
      {tag: 'circle'}, {tag: 'path'}
    ]);
  });

  it('should trim whitespaces in selectors', function () {
    transformSelectorToMatcher('         circle,  path ').should.be.eql([
      {tag: 'circle'}, {tag: 'path'}
    ]);
  });
});

describe('Fill posthtml plugin', function() {
  test(
    'should do nothing if fill option not provided',
    null,
    '<path />',
    '<path />'
  );

  test(
    'should process single tag',
    {fill: '#f00', selector: 'path'},
    '<path /><circle />',
    '<path fill="#f00" /><circle />'
  );

  test(
    'should process multiple tags',
    {fill: 'red', selector: 'path, circle'},
    '<path /><circle />',
    '<path fill="red" /><circle fill="red" />'
  );

});