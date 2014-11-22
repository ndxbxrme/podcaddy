'use strict';

/**
 * @ngdoc overview
 * @name myApp
 * @description
 * # myApp
 *
 * Main module of the application.
 */
angular
  .module('myApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider, $locationProvider) {
  
    var checkLogin = function($q, $location, $http, User) {
      var deferred = $q.defer();
      $http.get('/api/user')
      .success(function(user){
        if(user) {
          User.user = user;
          deferred.resolve(user);
        }
        else {
          deferred.reject();
          $location.url('/login');
        }
      });
      return deferred.promise;
    };
  
    var softLogin = function($q, $http, User) {
      var deferred = $q.defer();
      $http.get('/api/user')
      .success(function(user) {
        User.user = user;
        deferred.resolve(user);
      });
      return deferred.promise;
    };
  
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {loggedIn:softLogin}
      })
      .when('/login', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {loggedIn:softLogin}
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        resolve: {loggedIn:checkLogin}
      })
      .when('/allfeeds', {
        templateUrl: 'views/allfeeds.html',
        controller: 'AllfeedsCtrl',
        resolve: {loggedIn:checkLogin}
      })
      .when('/myfeeds', {
        templateUrl: 'views/myfeeds.html',
        controller: 'MyfeedsCtrl',
        resolve: {loggedIn:checkLogin}
      })
      .when('/addabunchoffeeds', {
        templateUrl: 'views/addabunchoffeeds.html',
        controller: 'AddabunchoffeedsCtrl',
        resolve: {loggedIn:checkLogin}
      })
      .when('/:arg1?/:arg2?/:arg3?/:arg4', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {loggedIn:checkLogin}
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  })
  .run(function($rootScope, PagePlayer, NavService, $route) {
    $rootScope.loading = false;
    $rootScope.$on('$routeChangeSuccess', function(){
      if($route && $route.current) {
          NavService.filters.feed = 'all';
          NavService.filters.playlist = 'none';
          NavService.filters.period = 'week';
          NavService.filters.direction = 'desc';
          NavService.filters.visited = 'unvisited';
          for(var f=1; f<5; f++) {
              NavService.parseArg($route.current.params['arg' + f]);   
          }
          if($route.current.$$route.controller==='MainCtrl') {
            NavService.filters.page = '/';
            PagePlayer.changePage();
          }
          else if($route.current.$$route.controller==='AllfeedsCtrl') {
            NavService.filters.page = '/allfeeds';          
          }
          else if($route.current.$$route.controller==='MyfeedsCtrl') {
            NavService.filters.page = '/myfeeds';          
          }
          else if($route.current.$$route.controller==='ProfileCtrl') {
            NavService.filters.page = '/profile';          
          }
          $.scrollTo(0, 600, {axis:'y'});
      }
    });
  });
  soundManager.setup({
    flashVersion: 9,
    preferFlash: true,
    url: 'swf/'
  });