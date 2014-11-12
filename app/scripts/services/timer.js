'use strict';

/**
 * @ngdoc service
 * @name myApp.Timer
 * @description
 * # Timer
 * Factory in the myApp.
 */
angular.module('myApp')
  .factory('Timer', function ($interval, PagePlayer) {
    var int;
    var start = function(){
      int = $interval(function(){
        PagePlayer.fetchData();
      }, 1000 * 60 * 5);
    };
    var stop = function(){
      if(angular.isDefined(int)) {
        $interval.cancel(int); 
      }
    };
    return {
      start: start,
      stop: stop
    };
  });
