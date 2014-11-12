'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myApp
 */
angular.module('myApp')
.controller('MainCtrl', function ($scope, $http, $location) {
  $scope.login = function(){
    $scope.submitted = true;
    if($scope.loginForm.$valid) {
      $http.post('/api/login', $scope.userform)
      .success(function(){
        $location.path('/');
        $scope.submitted = false;
      });
    }
  };
  $scope.signup = function(){
    $scope.submitted = true;
    if($scope.loginForm.$valid) {
      $http.post('/api/signup', $scope.userform)
      .success(function(){
        $location.path('/');
      });
    }
  };
  $scope.logout = function(){
    $http.get('/api/logout');
  };
});
