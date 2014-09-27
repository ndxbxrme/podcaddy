'use strict';

describe('Service: PagePlayer', function () {

  // load the service's module
  beforeEach(module('podcaddyApp'));

  // instantiate service
  var PagePlayer;
  beforeEach(inject(function (_PagePlayer_) {
    PagePlayer = _PagePlayer_;
  }));

  it('should do something', function () {
    expect(!!PagePlayer).toBe(true);
  });

});
