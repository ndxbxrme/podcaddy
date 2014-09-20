'use strict';

describe('Directive: allfeedsitem', function () {

  // load the directive's module
  beforeEach(module('podcaddyApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<allfeedsitem></allfeedsitem>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the allfeedsitem directive');
  }));
});
