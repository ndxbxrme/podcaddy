'use strict';

describe('Directive: nowplaying', function () {

  // load the directive's module
  beforeEach(module('myApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<nowplaying></nowplaying>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the nowplaying directive');
  }));
});
