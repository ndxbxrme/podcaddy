'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:AllfeedsCtrl
 * @description
 * # AllfeedsCtrl
 * Controller of the myApp
 */
angular.module('myApp')
  .controller('AllfeedsCtrl', function ($scope, $rootScope, $http, $location, LazyLoad, Timer) {
    $rootScope.cssPage = 'allfeedsPage';
    Timer.stop();
    $rootScope.loading = true;
    $http.post('/api/pods/all')
    .success(function(feeds){
      $rootScope.loading = false;
      $scope.lazyLoad = new LazyLoad(feeds);
      //doScroll();
    });
  
    $scope.initFeeds = function() {
      $scope.fetchingFeeds = true;
      $http.post('api/pods/init')
      .success(function(){
        //$location.path('/allfeeds');
      });
    };
  });
