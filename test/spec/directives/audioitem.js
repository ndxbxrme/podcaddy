'use strict';

describe('Directive: audioitem', function () {

  // load the directive's module
  beforeEach(module('podcaddyApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<audioitem></audioitem>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the audioitem directive');
  }));
});
