'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the myApp
 */
angular.module('myApp')
  .controller('ProfileCtrl', function ($scope) {
    $scope.data = 'homm';
    /*$http.get('/api')
    .success(function(data){
      $scope.data = data;
    });*/
  });
