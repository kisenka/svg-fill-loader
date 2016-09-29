require('chai').should();
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

describe('Plugin wrapper', () => {
  describe('.transformSelectorToMatcher', () => {
    it('should support single tag selector', () => {
      transformSelectorToMatcher('path').should.be.eql([
        {tag: 'path'}
      ]);

      transformSelectorToMatcher('circle,path').should.be.eql([
        {tag: 'circle'},
        {tag: 'path'}
      ]);
    });

    it('should trim whitespaces in selectors', () => {
      transformSelectorToMatcher('         circle,  path ').should.be.eql([
        {tag: 'circle'},
        {tag: 'path'}
      ]);
    });

    it('should support #id selector', () => {
      transformSelectorToMatcher('#circle').should.be.eql([
        {attrs: {id: 'circle'}}
      ]);

      transformSelectorToMatcher('path, #circle').should.be.eql([
        {tag: 'path'},
        {attrs: {id: 'circle'}}
      ]);
    });

    it('should support #class selector', () => {
      transformSelectorToMatcher('.circle').should.be.eql([
        {attrs: {'class': 'circle'}}
      ]);

      transformSelectorToMatcher('path, .circle').should.be.eql([
        {tag: 'path'},
        {attrs: {'class': 'circle'}}
      ]);
    });
  });

  describe('Plugin', () => {
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

    test(
      'should process #id selectors',
      {fill: 'red', selector: '#id'},
      '<path id="id" /><circle />',
      '<path id="id" fill="red" /><circle />'
    );

    test(
      'should process .class selectors',
      {fill: 'red', selector: '.class'},
      '<path class="class" /><circle />',
      '<path class="class" fill="red" /><circle />'
    );

    test(
      'should overwrite fill attribute',
      {fill: 'blue'},
      '<path fill="red" />',
      '<path fill="blue" />'
    );

    test(
      'should preserve nested tags',
      {fill: 'red', renderOptions: { singleTags: ['animate'] }},
      '<rect><animate /></rect>',
      '<rect fill="red"><animate /></rect>'
    )
  });
});