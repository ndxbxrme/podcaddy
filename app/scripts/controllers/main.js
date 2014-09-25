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
  $scope.refreshFeeds = function(){
    $http.get('/api/subscribed/' + $scope.filters.feed + '/' + $scope.filters.playlist + '/' + $scope.filters.period + '/' + $scope.filters.visited + '/' + $scope.filters.direction)
    .success(function(items){
      $scope.items = items;
      if(pagePlayer) {
          pagePlayer.init();
          //console.log(pagePlayer.lastSound.url);
      }
    });
  };
  $interval($scope.refreshFeeds, 1000 * 60 * 5);
  $scope.refreshFeeds();
});
