'use strict';

describe('Directive: myfeedsitem', function () {

  // load the directive's module
  beforeEach(module('myApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<myfeedsitem></myfeedsitem>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the myfeedsitem directive');
  }));
});
