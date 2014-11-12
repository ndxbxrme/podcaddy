'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:MyfeedsCtrl
 * @description
 * # MyfeedsCtrl
 * Controller of the myApp
 */
angular.module('myApp')
  .controller('MyfeedsCtrl', function ($scope, $http, Timer) {
    Timer.stop();
    $http.post('/api/feeds/subs')
    .success(function(feeds){
      $scope.feeds = feeds;
    });
  });
