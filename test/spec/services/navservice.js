'use strict';

describe('Service: NavService', function () {

  // load the service's module
  beforeEach(module('myApp'));

  // instantiate service
  var NavService;
  beforeEach(inject(function (_NavService_) {
    NavService = _NavService_;
  }));

  it('should do something', function () {
    expect(!!NavService).toBe(true);
  });

});
