'use strict';

describe('Service: MonkeyPatch', function () {

  // load the service's module
  beforeEach(module('podcaddyApp'));

  // instantiate service
  var MonkeyPatch;
  beforeEach(inject(function (_MonkeyPatch_) {
    MonkeyPatch = _MonkeyPatch_;
  }));

  it('should do something', function () {
    expect(!!MonkeyPatch).toBe(true);
  });

});
