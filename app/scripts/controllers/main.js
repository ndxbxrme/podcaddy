'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http.get('/api')
    .success(function(data){
      $scope.data = data; 
    });
  });
