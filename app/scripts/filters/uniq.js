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
      input.sort(function(a, b) {
        var dateA = Date.parse(a.createdAt);
        var dateB = Date.parse(b.createdAt);
        if(dateA > dateB) {
          return 1; 
        }
        if(dateA < dateB) {
          return -1; 
        }
      });
      return _.uniq(input, function(i) {
        return i.pubDate;
      });
    };
  });
