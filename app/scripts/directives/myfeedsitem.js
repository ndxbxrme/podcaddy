'use strict';

/**
 * @ngdoc directive
 * @name podcaddyApp.directive:myfeedsitem
 * @description
 * # myfeedsitem
 */
angular.module('podcaddyApp')
  .directive('myfeedsitem', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the myfeedsitem directive');
      }
    };
  });
