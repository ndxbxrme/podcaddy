'use strict';

describe('Controller: PageplayerCtrl', function () {

  // load the controller's module
  beforeEach(module('myApp'));

  var PageplayerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PageplayerCtrl = $controller('PageplayerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
