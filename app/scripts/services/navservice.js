'use strict';

/**
 * @ngdoc service
 * @name podcaddyApp.NavService
 * @description
 * # NavService
 * Factory in the podcaddyApp.
 */
angular.module('podcaddyApp')
  .factory('NavService', function ($route,$location) {
    var filters = {
      period : 'week',
      visited : 'unvisited',
      direction : 'desc',
      feed : 'all',
      playlist : 'none'
    };
    var parseArgs = function() {
      function parseArg(arg){
        if(arg.indexOf('feed-')===0) {
          filters.feed = arg.replace(/feed-/,''); 
        }
        if(arg.indexOf('playlist-')===0) {
          filters.playlist = arg.replace(/playlist-/,''); 
        }
        console.log(arg);
        switch(arg) {
          case 'day':
            filters.period = 'day';
            break;
          case 'week':
            filters.period = 'week';
            break;
          case 'month':
            filters.period = 'month';
            break;
          case 'year':
            filters.period = 'year';
            break;
          case 'alltime':
            filters.period = 'alltime';
            break;
          case 'visited':
            filters.visited = 'visited';
            break;
          case 'unvisited':
            filters.visited = 'unvisited';
            break;
          case 'all':
            filters.visited = 'all';
            break;
          case 'desc':
            filters.direction = 'desc';
            break;
          case 'asc':
            filters.direction = 'asc';
            break;
        }
      }
      if($route && $route.current) {
        if($route.current.params.arg1) {
          parseArg($route.current.params.arg1); 
        }
        if($route.current.params.arg2) {
          parseArg($route.current.params.arg2); 
        }
        if($route.current.params.arg3) {
          parseArg($route.current.params.arg3); 
        }
        if($route.current.params.arg4) {
          parseArg($route.current.params.arg4); 
        }
        if($route.current.$$route.controller==='MainCtrl') {
          filters.page = '/';
        }
        else if($route.current.$$route.controller==='AllfeedsCtrl') {
          filters.page = '/allfeeds';          
        }
        else if($route.current.$$route.controller==='MyfeedsCtrl') {
          filters.page = '/myfeeds';          
        }
      }
    };
    
    var redirect = function(){
      var url = (filters.feed==='all'?'':'/feed-'+filters.feed) +
          (filters.playlist==='none'?'':'/playlist-'+filters.playlist) + 
          (filters.period==='week'?'':'/'+filters.period) +
          (filters.visited==='unvisited'?'':'/'+filters.visited) + 
          (filters.direction==='desc'?'':'/'+filters.direction);
      if(filters.page==='/allfeeds') {
        url = '/allfeeds'; 
      }
      else if(filters.page==='/myfeeds') {
        url = '/myfeeds'; 
      }
      $location.path(url);
    };
  
    return {
      parseArgs: parseArgs,
      filters: filters,
      redirect: redirect
    };
  });
