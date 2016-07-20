require('chai').should();
var postcss = require('postcss');
var encodeSharp = require('../lib/encodeSharpPostCSSPlugin');

function test(name, input, expected) {
  it(name, function (done) {
    postcss([encodeSharp()])
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
    '.a {background: url(./image.svg?param=#qwe&param2=qwe);}',
    '.a {background: url(./image.svg?param=%23qwe&param2=qwe);}'
  );

  test(
    'should encode only query param values',
    '.a {background: url(./image.svg?query#lalala);}',
    '.a {background: url(./image.svg?query#lalala);}'
  );

});