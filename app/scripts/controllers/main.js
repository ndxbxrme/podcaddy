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
  $scope.period = 'week';
  $scope.visited = 'unvisited';
  $scope.direction = 'desc';
  $scope.feed = 'all';
  $scope.playlist = 'none';
  function parseArg(arg){
    if(arg.indexOf('feed-')==0) {
      $scope.feed = arg.replace(/feed-/,''); 
    }
    if(arg.indexOf('playlist-')==0) {
      $scope.playlist = arg.replace(/playlist-/,''); 
    }
    console.log(arg);
    switch(arg) {
      case 'day':
        $scope.period = 'day';
        break;
      case 'week':
        $scope.period = 'week';
        break;
      case 'month':
        $scope.period = 'month';
        break;
      case 'year':
        $scope.period = 'year';
        break;
      case 'alltime':
        $scope.period = 'alltime';
        break;
      case 'visited':
        $scope.visited = 'visited';
        break;
      case 'unvisited':
        $scope.visited = 'unvisited';
        break;
      case 'all':
        $scope.visited = 'all';
        break;
      case 'desc':
        $scope.direction = 'desc';
        break;
      case 'asc':
        $scope.direction = 'asc';
        break;
    }
  }
  if($route.current.params.arg1) {
    parseArg($route.current.params.arg1); 
  }
  if($route.current.params.arg2) {
    parseArg($route.current.params.arg2); 
  }
  if($route.current.params.arg3) {
    parseArg($route.current.params.arg3); 
  }
  if($route.current.params.arg4) {
    parseArg($route.current.params.arg4); 
  }
  $http.get('/api/subscribed/' + $scope.feed + '/' + $scope.playlist + '/' + $scope.period + '/' + $scope.visited + '/' + $scope.direction)
  .success(function(items){
    $scope.items = items;
    if(pagePlayer) {
        pagePlayer.init();
    }
    console.log(items);
  });
});
