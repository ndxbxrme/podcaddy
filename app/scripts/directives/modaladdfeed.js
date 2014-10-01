'use strict';

/**
 * @ngdoc directive
 * @name podcaddyApp.directive:modalAddFeed
 * @description
 * # modalAddFeed
 */
angular.module('podcaddyApp')
  .directive('modalAddFeed', function () {
    return {
      templateUrl: '/views/modaladdfeed.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        
      }
    };
  });
