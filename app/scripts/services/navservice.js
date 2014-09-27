'use strict';

/**
 * @ngdoc service
 * @name podcaddyApp.NavService
 * @description
 * # NavService
 * Factory in the podcaddyApp.
 */
angular.module('podcaddyApp')
  .factory('NavService', function () {
    var filters = {
      period : 'week',
      visited : 'unvisited',
      direction : 'desc',
      feed : 'all',
      playlist : 'none'
    };
    var parseArgs = function($route) {
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
      }
    };
    
    return {
      parseArgs: parseArgs,
      filters: filters
    };
  });
