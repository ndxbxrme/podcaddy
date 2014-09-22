'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
.controller('MainCtrl', function ($scope, $http, $route, $timeout) {
  $scope.parseArgs($route);
  $http.get('/api/subscribed/' + $scope.feed + '/' + $scope.playlist + '/' + $scope.period + '/' + $scope.visited + '/' + $scope.direction)
  .success(function(items){
    $scope.items = items;
    if(pagePlayer) {
        pagePlayer.init();
    }
    console.log(items);
  });
});
