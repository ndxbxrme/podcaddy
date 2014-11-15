'use strict';

/**
 * @ngdoc filter
 * @name myApp.filter:unambiguate
 * @function
 * @description
 * # unambiguate
 * Filter in the myApp.
 */
angular.module('myApp')
  .filter('unambiguate', function () {
    return function (input) {
      return input.replace(/less than |more than |about /gi,'').replace('a minute ago', 'Now');
    };
  });
