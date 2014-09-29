'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
.controller('MainCtrl', function ($rootScope,$interval,PagePlayer) {
  $rootScope.hasNav = true;
  $interval(function(){
    PagePlayer.fetchData();
  }, 1000 * 60 * 5);
});
