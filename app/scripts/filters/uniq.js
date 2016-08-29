'use strict';

/**
 * @ngdoc filter
 * @name myApp.filter:listened
 * @function
 * @description
 * # listened
 * Filter in the myApp.
 */
angular.module('myApp')
  .filter('uniq', function () {
    return function (input) {
      return _.uniq(input, function(i) {
        return i.title;
      });
    };
  });
