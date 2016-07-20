require('chai').should();
var postcss = require('postcss');
var encodeSharp = require('../lib/encodeSharpPostCSSPlugin');

function test(name, options, input, expected) {
  it(name, function (done) {
    postcss([ encodeSharp(options) ])
      .process(input)
      .then(function (result) {
        result.css.should.be.eql(expected);
        done();
      })
      .catch(done);
  })
}

describe('Encode sharp in query string postcss plugin', function() {

  test(
    'should encode',
    null,
    '.a {background: url(./image.svg?param=#qwe&param2=qwe);}',
    '.a {background: url(./image.svg?param=%23qwe&param2=qwe);}'
  );

  test(
    'should encode only query param values',
    null,
    '.a {background: url(./image.svg?query#lalala);}',
    '.a {background: url(./image.svg?query#lalala);}'
  );

});