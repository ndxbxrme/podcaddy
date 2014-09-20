'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:AllfeedsCtrl
 * @description
 * # AllfeedsCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
  .controller('AllfeedsCtrl', function ($scope, $http) {
    $http.post('/api/allfeeds')
    .success(function(feeds){
      $scope.feeds = feeds;
    });
  });
