'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
.controller('MainCtrl', function ($rootScope, $http, Timer, LazyLoad) {
  $rootScope.cssPage = 'mainPage';
  Timer.start();
  if(angular.isDefined($rootScope.lazyLoad)) {
    $rootScope.lazyLoad.doScroll();
  }
  //$http.post('/api');
});
