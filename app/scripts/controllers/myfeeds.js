'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:MyfeedsCtrl
 * @description
 * # MyfeedsCtrl
 * Controller of the myApp
 */
angular.module('myApp')
  .controller('MyfeedsCtrl', function ($scope, $rootScope, $http, Timer, LazyLoad) {
    $rootScope.cssPage = 'allfeedsPage';
    Timer.stop();
    $rootScope.loading = true;
    $http.post('/api/pods/subs')
    .success(function(feeds){
      $rootScope.loading = false;
      $scope.lazyLoad = new LazyLoad(feeds);
    });
  });
