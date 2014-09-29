'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:AllfeedsCtrl
 * @description
 * # AllfeedsCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
  .controller('AllfeedsCtrl', function ($scope, $http, $location, $window) {
    console.log('check me out');
    $http.post('/api/feeds/all')
    .success(function(feeds){
      $scope.feeds = feeds;
    });
  
    $scope.initFeeds = function() {
      $scope.fetchingFeeds = true;
      $http.post('api/feeds/init')
      .success(function(data){
        //$location.path('/allfeeds');
      });
    };
    $($window).scroll(function(){
      console.log('yo');
    });
  });
