'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:AllfeedsCtrl
 * @description
 * # AllfeedsCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
  .controller('AllfeedsCtrl', function ($scope, $rootScope, $http, $location, LazyLoad, Timer) {
    $rootScope.cssClass = 'allfeedsPage';
    Timer.stop();
    $http.post('/api/feeds/all')
    .success(function(feeds){
      $scope.lazyLoad = new LazyLoad(feeds);
      //doScroll();
    });
  
    $scope.initFeeds = function() {
      $scope.fetchingFeeds = true;
      $http.post('api/feeds/init')
      .success(function(data){
        //$location.path('/allfeeds');
      });
    };
  });
