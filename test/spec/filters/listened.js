'use strict';

describe('Filter: listened', function () {

  // load the filter's module
  beforeEach(module('myApp'));

  // initialize a new instance of the filter before each test
  var listened;
  beforeEach(inject(function ($filter) {
    listened = $filter('listened');
  }));

  it('should return the input prefixed with "listened filter:"', function () {
    var text = 'angularjs';
    expect(listened(text)).toBe('listened filter: ' + text);
  });

});
