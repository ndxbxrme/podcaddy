'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:PageplayerCtrl
 * @description
 * # PageplayerCtrl
 * Controller of the myApp
 */
angular.module('myApp')
  .controller('PageplayerCtrl', function ($route, $rootScope, Timer) {
    $rootScope.cssPage = 'mainPage';
    Timer.start();
    if(angular.isDefined($rootScope.lazyLoad)) {
      $rootScope.lazyLoad.doScroll();
    } 
  });
