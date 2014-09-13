'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
