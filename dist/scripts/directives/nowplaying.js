'use strict';

/**
 * @ngdoc directive
 * @name myApp.directive:nowplaying
 * @description
 * # nowplaying
 */
angular.module('myApp')
  .directive('nowPlaying', function (PagePlayer) {
    return {
      templateUrl: '/views/nowplaying.html',
      restrict: 'E',
      replace: true,
      link: function(scope) {
        scope.togglePlay = function(item){
          PagePlayer.togglePlay(item);
        };
        scope.skip = function(item){
          PagePlayer.skip(item);
        };
      }
    };
  });
