'use strict';

/**
 * @ngdoc directive
 * @name podcaddyApp.directive:nowPlaying
 * @description
 * # nowPlaying
 */
angular.module('podcaddyApp')
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
