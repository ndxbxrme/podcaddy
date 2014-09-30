'use strict';

/**
 * @ngdoc service
 * @name podcaddyApp.Timer
 * @description
 * # Timer
 * Factory in the podcaddyApp.
 */
angular.module('podcaddyApp')
  .factory('Timer', function ($interval, PagePlayer) {
    var int;
    var start = function(){
      int = $interval(function(){
        PagePlayer.fetchData();
      }, 1000 * 60 * 5);
    };
    var stop = function(){
      if(int) {
        int.clearInterval(); 
      }
    };
    return {
      start: start,
      stop: stop
    };
  });
