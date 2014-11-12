'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:PageplayerCtrl
 * @description
 * # PageplayerCtrl
 * Controller of the myApp
 */
angular.module('myApp')
  .controller('PageplayerCtrl', function ($route, $rootScope, Timer, NavService, PagePlayer) {
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
    }
    $rootScope.cssPage = 'mainPage';
    Timer.start();
    if(angular.isDefined($rootScope.lazyLoad)) {
      $rootScope.lazyLoad.doScroll();
    } 
  });
