'use strict';

describe('Filter: widow', function () {

  // load the filter's module
  beforeEach(module('podcaddyApp'));

  // initialize a new instance of the filter before each test
  var widow;
  beforeEach(inject(function ($filter) {
    widow = $filter('widow');
  }));

  it('should return the input prefixed with "widow filter:"', function () {
    var text = 'angularjs';
    expect(widow(text)).toBe('widow filter: ' + text);
  });

});
