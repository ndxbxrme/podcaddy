'use strict';

describe('Directive: dropDown', function () {

  // load the directive's module
  beforeEach(module('podcaddyApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<drop-down></drop-down>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dropDown directive');
  }));
});
