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

describe('Encode sharp in query string postcss plugin', () => {

  test(
    'should encode',
    null,
    '.a {background: url(./image.svg?param=#qwe&param2=qwe);}',
    '.a {background: url(./image.svg?param=%23qwe&param2=qwe);}'
  );

  test(
    'should encode only query param values',
    null,
    '.a {background: url(./image.svg#lalala);}',
    '.a {background: url(./image.svg#lalala);}'
  );

  /**
   * TODO
   * This case should return modified value because urijs normalize URLs like 'font.eot?#iefix'
   * @see https://github.com/iAdramelk/postcss-helpers/blob/master/lib/url.js#L70
   * @see https://github.com/iAdramelk/postcss-helpers/blob/master/test/test.js#L37
   */
  test(
    'should modify fragment part with empty query (TODO)',
    null,
    '.a {background: url(./image.svg?#lalala);}',
    '.a {background: url(./image.svg#lalala);}'
  );

  test(
    'should not modify fragment with query param without value',
    null,
    '.a {background: url(./image.svg?q#lalala);}',
    '.a {background: url(./image.svg?q#lalala);}'
  );

  test(
    'should encode fragment with empty query param value',
    null,
    '.a {background: url(./image.svg?q=#lalala);}',
    '.a {background: url(./image.svg?q=%23lalala);}'
  );

  test(
    'should encode sharp in every param',
    null,
    '.a {background: url(image.svg?fill=#f0f,#qwe&stroke=#000&tralala=#00ffdd#qwe)}',
    '.a {background: url(image.svg?fill=%23f0f,%23qwe&stroke=%23000&tralala=%2300ffdd%23qwe)}'
  );
});