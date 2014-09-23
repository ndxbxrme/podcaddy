'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
.controller('MainCtrl', function ($scope, $http, $route, $interval) {
  $scope.parseArgs($route);
  $scope.refreshFeeds = function(){
    $http.get('/api/subscribed/' + $scope.feed + '/' + $scope.playlist + '/' + $scope.period + '/' + $scope.visited + '/' + $scope.direction)
    .success(function(items){
      $scope.items = items;
      if(pagePlayer) {
          pagePlayer.init();
      }
      console.log(items);
    });
  };
  $interval($scope.refreshFeeds, 1000 * 60 * 5);
  $scope.refreshFeeds();
});
