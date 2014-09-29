'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:MyfeedsCtrl
 * @description
 * # MyfeedsCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
  .controller('MyfeedsCtrl', function ($scope, $http) {
    $http.post('/api/feeds/subs')
    .success(function(feeds){
      $scope.feeds = feeds;
    });
  });
