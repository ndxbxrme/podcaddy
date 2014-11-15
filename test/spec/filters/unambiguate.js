'use strict';

describe('Filter: unambiguate', function () {

  // load the filter's module
  beforeEach(module('myApp'));

  // initialize a new instance of the filter before each test
  var unambiguate;
  beforeEach(inject(function ($filter) {
    unambiguate = $filter('unambiguate');
  }));

  it('should return the input prefixed with "unambiguate filter:"', function () {
    var text = 'angularjs';
    expect(unambiguate(text)).toBe('unambiguate filter: ' + text);
  });

});
