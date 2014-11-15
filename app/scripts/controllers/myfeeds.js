'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:MyfeedsCtrl
 * @description
 * # MyfeedsCtrl
 * Controller of the myApp
 */
angular.module('myApp')
  .controller('MyfeedsCtrl', function ($scope, $http, Timer, LazyLoad) {
    Timer.stop();
    $http.post('/api/pods/subs')
    .success(function(feeds){
      $scope.lazyLoad = new LazyLoad(feeds);
    });
  });
