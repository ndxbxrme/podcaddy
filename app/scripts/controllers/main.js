'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
.controller('MainCtrl', function ($rootScope, $http, Timer) {
  $rootScope.cssPage = 'mainPage';
  Timer.start();
  //$http.post('/api');
});
