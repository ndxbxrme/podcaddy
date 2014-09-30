'use strict';

/**
 * @ngdoc service
 * @name podcaddyApp.LazyLoad
 * @description
 * # LazyLoad
 * Factory in the podcaddyApp.
 */
angular.module('podcaddyApp')
  .factory('LazyLoad', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
