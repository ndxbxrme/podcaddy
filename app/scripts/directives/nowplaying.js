'use strict';

/**
 * @ngdoc directive
 * @name podcaddyApp.directive:nowPlaying
 * @description
 * # nowPlaying
 */
angular.module('podcaddyApp')
  .directive('nowPlaying', function () {
    return {
      templateUrl: '/views/nowplaying.html',
      restrict: 'E',
      replace: true,
      link: function() {
      }
    };
  });
