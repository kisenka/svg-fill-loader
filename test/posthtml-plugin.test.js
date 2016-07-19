require('chai').should();
var transform = require('../lib/posthtml-plugin').transformSelectorToMatcher;
var process = require('../lib/process');

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
    transform('path').should.be.eql([ {tag: 'path'} ]);
  });

  it('should support tag selectors separated by comma', function () {
    transform('circle,path').should.be.eql([
      {tag: 'circle'}, {tag: 'path'}
    ]);
  });

  it('should trim whitespaces in selectors', function () {
    transform('         circle,  path ').should.be.eql([
      {tag: 'circle'}, {tag: 'path'}
    ]);
  });
});

describe('Fill plugin', function() {
  test(
    'should do nothing if fill option not provided',
    null,
    '<path />',
    '<path />'
  );

  test(
    'should single tag',
    {fill: '#f00'},
    '<path />',
    '<path fill="#f00" />'
  );

  test(
    'should fill multiple tags',
    {fill: 'red', selector: 'path, circle'},
    '<path /><circle />',
    '<path fill="red" /><circle fill="red" />'
  )
});