'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:AllfeedsCtrl
 * @description
 * # AllfeedsCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
  .controller('AllfeedsCtrl', function ($scope, $http, $timeout) {
    $http.post('/api/feeds/all')
    .success(function(feeds){
      $scope.feeds = feeds;
      $timeout(function(){
      var s = skrollr.init();
      }, 10);
      console.log(feeds);
    });
  
    $scope.initFeeds = function() {
      $scope.progress = 'Fetching Feeds';
      $http.post('api/feeds/init')
      .success(function(){
        $scope.progres = 'done';
      });
    };
  });
