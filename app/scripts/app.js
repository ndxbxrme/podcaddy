'use strict';

/**
 * @ngdoc overview
 * @name podcaddyApp
 * @description
 * # podcaddyApp
 *
 * Main module of the application.
 */
angular
  .module('podcaddyApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.utils'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/allfeeds', {
        templateUrl: 'views/allfeeds.html',
        controller: 'AllfeedsCtrl'
      })
      .when('/:arg1?/:arg2?/:arg3?/:arg4', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      
      .otherwise({
        redirectTo: '/'
      });
  
      $locationProvider.html5Mode(true);
  })
  .run(function($rootScope, PagePlayer, $http) {
    $rootScope.items = [];
    $rootScope.$on('$routeChangeSuccess', function(){
      PagePlayer.changePage();
    });
    $http.post('/api'); //kickstart login
  })
;

soundManager.setup({
  flashVersion: 9,
  preferFlash: true,
  url: 'bower_components/soundmanager/swf/'
});