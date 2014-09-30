'use strict';

describe('Service: LazyLoad', function () {

  // load the service's module
  beforeEach(module('podcaddyApp'));

  // instantiate service
  var LazyLoad;
  beforeEach(inject(function (_LazyLoad_) {
    LazyLoad = _LazyLoad_;
  }));

  it('should do something', function () {
    expect(!!LazyLoad).toBe(true);
  });

});
